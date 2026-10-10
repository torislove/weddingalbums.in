import crypto from 'crypto';
import { sendEmailNotification } from './utils.js';

// In-memory OTP store: Key -> { code, expiresAt, attempts, purpose }
const otpStore = new Map();

// Helper to generate a 6-digit numeric OTP
export function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send an OTP to an email address
 * @param {string} email
 * @param {string} purpose 'login' | 'register' | 'forgot_password' | 'verify'
 */
export async function sendEmailOtp(email, purpose = 'login') {
  const normalizedEmail = email.trim().toLowerCase();
  const code = generateOtpCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(`${purpose}:${normalizedEmail}`, {
    code,
    expiresAt,
    attempts: 0,
    purpose
  });

  const titles = {
    login: 'Login Verification Code',
    register: 'Account Registration Verification',
    forgot_password: 'Password Reset Verification',
    verify: 'Email Verification Code'
  };

  const subject = `[WeddingAlbums.in] ${titles[purpose] || 'Your Verification Code'}: ${code}`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; background: #0c0d12; color: #f0f0f5; border-radius: 12px; border: 1px solid #2a2820;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 28px;">💍</span>
        <h2 style="color: #d4af37; margin: 8px 0 0; letter-spacing: 1px;">WeddingAlbums.in</h2>
        <p style="color: #888899; font-size: 13px; margin: 4px 0 0;">Premium Post-Production & Wedding Books</p>
      </div>

      <div style="background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="color: #cccccc; font-size: 14px; margin: 0 0 10px;">Your One-Time Verification Code is:</p>
        <div style="font-size: 36px; font-weight: 700; color: #d4af37; letter-spacing: 8px; margin: 12px 0;">${code}</div>
        <p style="color: #888899; font-size: 12px; margin: 8px 0 0;">This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>

      <p style="color: #9999aa; font-size: 13px; line-height: 1.5;">
        You received this email because an action was requested for your WeddingAlbums.in account. If you did not initiate this request, you can safely ignore this email.
      </p>

      <div style="border-top: 1px solid #1f2129; margin-top: 24px; padding-top: 16px; text-align: center; color: #666677; font-size: 11px;">
        © ${new Date().getFullYear()} WeddingAlbums.in · All rights reserved.
      </div>
    </div>
  `;

  console.log(`🔑 [OTP] ${purpose.toUpperCase()} OTP for ${normalizedEmail}: ${code}`);
  
  const sent = await sendEmailNotification(normalizedEmail, subject, html);
  return { success: true, sent, debugCode: process.env.NODE_ENV !== 'production' ? code : undefined };
}

/**
 * Send an OTP to a phone number (simulation/fallback for backend SMS)
 * @param {string} phone
 * @param {string} purpose
 */
export async function sendPhoneOtp(phone, purpose = 'login') {
  const normalizedPhone = phone.trim().replace(/\s+/g, '');
  const code = generateOtpCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(`${purpose}:${normalizedPhone}`, {
    code,
    expiresAt,
    attempts: 0,
    purpose
  });

  console.log(`📱 [SMS OTP] ${purpose.toUpperCase()} OTP for ${normalizedPhone}: ${code}`);
  return { success: true, debugCode: process.env.NODE_ENV !== 'production' ? code : undefined };
}

/**
 * Verify an OTP code
 * @param {string} target Destination (email or phone)
 * @param {string} code 6-digit code
 * @param {string} purpose
 */
export function verifyOtp(target, code, purpose = 'login') {
  const normalizedTarget = target.trim().toLowerCase().replace(/\s+/g, '');
  const key = `${purpose}:${normalizedTarget}`;
  const entry = otpStore.get(key);

  if (!entry) {
    return { valid: false, error: 'No verification code found. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return { valid: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (entry.attempts >= 5) {
    otpStore.delete(key);
    return { valid: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  if (entry.code !== code.toString().trim()) {
    entry.attempts += 1;
    return { valid: false, error: 'Invalid verification code. Please try again.' };
  }

  // Code verified! Remove to prevent reuse
  otpStore.delete(key);
  return { valid: true };
}
