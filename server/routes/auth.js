import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { User, RefreshToken, AuditLog } from '../db.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';

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
    
    await RefreshToken.create({
      user_id: user._id || user.id,
      token_hash: refreshTokenHash,
      expires_at: expiresAt
    });

    await AuditLog.create({
      user_id: user._id || user.id,
      action: 'USER_LOGIN',
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

export default router;
