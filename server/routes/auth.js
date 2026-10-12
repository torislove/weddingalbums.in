import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { User, RefreshToken, AuditLog } from '../db.js';
import { loginRateLimiter, otpRateLimiter } from '../middleware/rateLimit.js';
import { sendEmailOtp, sendPhoneOtp, verifyOtp } from '../otpService.js';
import { verifyFirebaseToken } from '../firebaseAdmin.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_wedding_key_2026';

const AUDIENCE_MAP = {
  b2c:       'client-portal',
  b2b:       'b2b-portal',
  editor:    'editor-portal',
  admin:     'admin-portal',
  sysadmin:  'sysadmin-portal',
  content_admin: 'uiadmin-portal'
};

const generateTokens = (user) => {
  const audience = AUDIENCE_MAP[user.role] || 'client-portal';
  
  const accessToken = jwt.sign(
    { id: user._id || user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h', audience, issuer: 'weddingalbums.in' }
  );

  const refreshTokenValue = crypto.randomBytes(40).toString('hex');
  const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenValue).digest('hex');
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  return { accessToken, refreshTokenValue, refreshTokenHash, expiresAt: expiresAt.toISOString() };
};

router.post('/register', async (req, res) => {
  const { 
    name, email, password, role, 
    phone, city, studioName, gstNumber, 
    coupleNames, weddingDate, portfolioLink, specialization,
    referredByEmail
  } = req.body;
  
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields required' });

  // Do not allow registering admin roles via public endpoint
  if (['admin', 'sysadmin', 'content_admin'].includes(role)) {
    return res.status(403).json({ error: 'Cannot register admin roles' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, email, password: hashedPassword, role,
      phone, city, studioName, gstNumber, 
      coupleNames, weddingDate, portfolioLink, specialization,
      wallet_balance: referredByEmail ? 500 : 0
    });
    
    if (referredByEmail) {
      const referrer = await User.findOne({ email: referredByEmail });
      if (referrer) {
        await User.updateWalletBalance(referrer._id || referrer.id, 1000);
      }
    }
    
    const { accessToken, refreshTokenValue, refreshTokenHash, expiresAt } = generateTokens(user);
    
    await RefreshToken.create({
      user_id: user._id || user.id,
      token_hash: refreshTokenHash,
      expires_at: expiresAt
    });
    
    await AuditLog.create({
      user_id: user._id || user.id,
      action: 'USER_REGISTERED',
      details: `Role: ${role}`,
      ip: req.ip
    });

    res.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      token: accessToken, 
      user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, wallet_balance: user.wallet_balance } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', loginRateLimiter, async (req, res) => {
  const { email, password, portalRole } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Optional: Validate that the user's role matches the portal they are trying to log into
    if (portalRole && user.role !== portalRole && user.role !== 'admin' && user.role !== 'sysadmin') {
      return res.status(403).json({ error: 'Access denied to this portal' });
    }

    const { accessToken, refreshTokenValue, refreshTokenHash, expiresAt } = generateTokens(user);
    
    try {
      await RefreshToken.create({
        user_id: user._id || user.id,
        token_hash: refreshTokenHash,
        expires_at: expiresAt
      });
    } catch (e) {
      console.warn('RefreshToken create non-fatal error:', e.message);
    }

    try {
      await AuditLog.create({
        user_id: user._id || user.id,
        action: 'USER_LOGIN',
        ip: req.ip
      });
    } catch (e) {
      console.warn('AuditLog create non-fatal error:', e.message);
    }

    try {
      res.cookie('refreshToken', refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    } catch (e) {
      console.warn('Cookie set notice:', e.message);
    }

    res.json({ 
      token: accessToken, 
      user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, wallet_balance: user.wallet_balance } 
    });
  } catch (err) {
    console.error('Login endpoint error:', err);
    res.status(500).json({ error: 'Server error: ' + (err.message || 'Internal failure') });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshTokenValue = req.cookies?.refreshToken;
  if (!refreshTokenValue) return res.status(401).json({ error: 'No refresh token provided' });

  const tokenHash = crypto.createHash('sha256').update(refreshTokenValue).digest('hex');
  
  try {
    const storedToken = await RefreshToken.findOne({ token_hash: tokenHash });
    
    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid or revoked refresh token' });
    }
    
    if (new Date(storedToken.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    const user = await User.findById(storedToken.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Revoke old token
    await RefreshToken.revoke(tokenHash);

    // Issue new tokens
    const { accessToken, refreshTokenValue: newRefresh, refreshTokenHash: newHash, expiresAt } = generateTokens(user);
    
    await RefreshToken.create({
      user_id: user._id || user.id,
      token_hash: newHash,
      expires_at: expiresAt
    });

    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ token: accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', async (req, res) => {
  const refreshTokenValue = req.cookies?.refreshToken;
  if (refreshTokenValue) {
    const tokenHash = crypto.createHash('sha256').update(refreshTokenValue).digest('hex');
    try {
      await RefreshToken.revoke(tokenHash);
    } catch (err) {
      console.error('Failed to revoke token during logout:', err);
    }
  }
  
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// OTP & FIREBASE AUTHENTICATION ENDPOINTS
// ==========================================

// Send OTP to email or phone
router.post('/send-otp', otpRateLimiter, async (req, res) => {
  const { target, type = 'email', purpose = 'login' } = req.body;
  if (!target) return res.status(400).json({ error: 'Target email or phone number is required' });

  try {
    if (purpose === 'forgot_password') {
      const user = await User.findOne({ email: target });
      if (!user) {
        return res.status(404).json({ error: 'No account registered with this email address' });
      }
    }

    if (type === 'email') {
      const result = await sendEmailOtp(target, purpose);
      return res.json({ success: true, message: 'Verification code sent to email', ...result });
    } else {
      const result = await sendPhoneOtp(target, purpose);
      return res.json({ success: true, message: 'Verification code sent to phone', ...result });
    }
  } catch (err) {
    console.error('send-otp error:', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { target, code, purpose = 'login' } = req.body;
  if (!target || !code) return res.status(400).json({ error: 'Target and verification code are required' });

  const result = verifyOtp(target, code, purpose);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ success: true, message: 'Verification successful' });
});

// Login via Email OTP or Phone OTP
router.post('/login-with-otp', loginRateLimiter, async (req, res) => {
  const { target, code, portalRole } = req.body;
  if (!target || !code) return res.status(400).json({ error: 'Target and verification code are required' });

  const verification = verifyOtp(target, code, 'login');
  if (!verification.valid) {
    return res.status(400).json({ error: verification.error });
  }

  try {
    let user = await User.findOne({ email: target });
    if (!user) {
      user = await User.findOne({ phone: target });
    }

    // Auto-create client user if logging into client portal
    if (!user) {
      const isEmail = target.includes('@');
      user = await User.create({
        name: isEmail ? target.split('@')[0] : `User ${target.slice(-4)}`,
        email: isEmail ? target : `${target.replace(/[^0-9]/g, '')}@phone.weddingalbums.in`,
        phone: !isEmail ? target : null,
        password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
        role: portalRole || 'b2c',
        wallet_balance: 0
      });
    }

    if (portalRole && user.role !== portalRole && user.role !== 'admin' && user.role !== 'sysadmin') {
      return res.status(403).json({ error: 'Access denied to this portal' });
    }

    const { accessToken, refreshTokenValue, refreshTokenHash, expiresAt } = generateTokens(user);

    await RefreshToken.create({
      user_id: user._id || user.id,
      token_hash: refreshTokenHash,
      expires_at: expiresAt
    });

    await AuditLog.create({
      user_id: user._id || user.id,
      action: 'USER_LOGIN_OTP',
      details: `Target: ${target}`,
      ip: req.ip
    });

    res.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      token: accessToken,
      user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, wallet_balance: user.wallet_balance }
    });
  } catch (err) {
    console.error('login-with-otp error:', err);
    res.status(500).json({ error: 'Server error during OTP login' });
  }
});

// Firebase Token Login (Google Auth & Firebase Phone OTP)
router.post('/firebase-login', async (req, res) => {
  const { idToken, portalRole } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Firebase ID token is required' });

  try {
    const decoded = await verifyFirebaseToken(idToken);
    const email = decoded.email || `${decoded.phone_number?.replace(/[^0-9]/g, '') || decoded.uid}@firebase.weddingalbums.in`;
    const name = decoded.name || decoded.email?.split('@')[0] || 'Client User';
    const phone = decoded.phone_number || null;

    let user = await User.findOne({ email });
    if (!user && phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      user = await User.create({
        name,
        email,
        phone,
        password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
        role: portalRole || 'b2c',
        wallet_balance: 0
      });
    }

    if (portalRole && user.role !== portalRole && user.role !== 'admin' && user.role !== 'sysadmin') {
      return res.status(403).json({ error: 'Access denied to this portal' });
    }

    const { accessToken, refreshTokenValue, refreshTokenHash, expiresAt } = generateTokens(user);

    await RefreshToken.create({
      user_id: user._id || user.id,
      token_hash: refreshTokenHash,
      expires_at: expiresAt
    });

    await AuditLog.create({
      user_id: user._id || user.id,
      action: 'USER_LOGIN_FIREBASE',
      details: `Provider: ${decoded.firebase?.sign_in_provider || 'firebase'}`,
      ip: req.ip
    });

    res.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      token: accessToken,
      user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, wallet_balance: user.wallet_balance }
    });
  } catch (err) {
    console.error('firebase-login error:', err.message);
    res.status(401).json({ error: 'Invalid Firebase authentication token' });
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', otpRateLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account registered with this email address' });
    }

    const result = await sendEmailOtp(email, 'forgot_password');
    res.json({ success: true, message: 'Password reset code has been sent to your email', ...result });
  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ error: 'Failed to send password reset code' });
  }
});

// Reset Password - Verify OTP & Update Password
router.post('/reset-password', loginRateLimiter, async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, verification code, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const verification = verifyOtp(email, otp, 'forgot_password');
  if (!verification.valid) {
    return res.status(400).json({ error: verification.error });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (User.updatePassword) {
      await User.updatePassword(user._id || user.id, hashedPassword);
    } else if (User.updateOne) {
      await User.updateOne({ _id: user._id || user.id }, { password: hashedPassword });
    }

    await AuditLog.create({
      user_id: user._id || user.id,
      action: 'PASSWORD_RESET',
      ip: req.ip
    });

    res.json({ success: true, message: 'Password reset successfully. You can now sign in with your new password.' });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
