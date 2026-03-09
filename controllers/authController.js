/**
 * Auth Controller - Email/Password, Google OAuth, Telegram Auth, JWT
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const db = require('../database');
const { generateTokens } = require('../middleware/auth');

// Email service (mock for dev, real for production)
const nodemailer = require('nodemailer');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const SALT_ROUNDS = 12;

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Create email transporter (mock in dev)
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  // Mock transporter for development
  return {
    sendMail: async (options) => {
      console.log('📧 Email would be sent:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body preview:', options.text?.substring(0, 100) + '...');
      return { messageId: 'mock-' + Date.now() };
    }
  };
};

// Generate random referral code
function generateReferralCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash password
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ============================================================
// EMAIL/PASSWORD AUTH
// ============================================================

// Register new user
async function register(req, res) {
  try {
    const { email, password, full_name, referral_code: usedReferralCode } = req.body;

    // Validation
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password and full name are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Handle referral
    let referred_by = null;
    if (usedReferralCode) {
      const referrer = await db.pool.query(
        'SELECT id FROM users WHERE referral_code = $1',
        [usedReferralCode.toUpperCase()]
      );
      if (referrer.rows.length > 0) {
        referred_by = referrer.rows[0].id;
      }
    }

    // Generate unique referral code
    let referral_code = generateReferralCode();
    let codeExists = true;
    while (codeExists) {
      const check = await db.pool.query('SELECT id FROM users WHERE referral_code = $1', [referral_code]);
      if (check.rows.length === 0) {
        codeExists = false;
      } else {
        referral_code = generateReferralCode();
      }
    }

    // Create user
    const user = await db.createUser({
      email: email.toLowerCase(),
      password_hash,
      full_name,
      referral_code,
      referred_by
    });

    // Create referral record if applicable
    if (referred_by) {
      await db.createReferral(referred_by, user.id, usedReferralCode);
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await db.createEmailVerificationCode(user.id, verificationCode, expiresAt);

    // Send verification email
    const transporter = createTransporter();
    await transporter.sendMail({
      to: email,
      subject: 'Verify your EthosLife account',
      text: `Welcome to EthosLife! Your verification code is: ${verificationCode}\n\nThis code expires in 24 hours.`,
      html: `
        <h1>Welcome to EthosLife!</h1>
        <p>Your verification code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 4px; background: #f0f0f0; padding: 20px; text-align: center;">${verificationCode}</h2>
        <p>This code expires in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `
    });

    console.log(`✅ New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', message: err.message });
  }
}

// Login with email/password
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user with password hash
    const user = await db.getUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.updateUser(user.id, { last_login_at: new Date() });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await db.createRefreshToken(user.id, refreshToken, expiresAt, req.headers['user-agent'], req.ip);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role: user.role,
        isEmailVerified: user.is_email_verified,
        subscriptionTier: user.subscription_tier
      },
      token: accessToken,
      refreshToken
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed', message: err.message });
  }
}

// Verify email
async function verifyEmail(req, res) {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and verification code are required' });
    }

    const verification = await db.getEmailVerificationCode(userId, code);
    if (!verification) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    if (verification.attempts >= 5) {
      await db.deleteEmailVerificationCode(verification.id);
      return res.status(400).json({ error: 'Too many attempts. Please request a new code.' });
    }

    await db.incrementCodeAttempts(verification.id);

    // Verify user
    await db.updateUser(userId, {
      is_email_verified: true,
      email_verified_at: new Date()
    });

    await db.deleteEmailVerificationCode(verification.id);

    res.json({ success: true, message: 'Email verified successfully' });

  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ error: 'Verification failed', message: err.message });
  }
}

// Resend verification email
async function resendVerification(req, res) {
  try {
    const { email } = req.body;

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate new code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await db.createEmailVerificationCode(user.id, verificationCode, expiresAt);

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      to: email,
      subject: 'Verify your EthosLife account',
      text: `Your new verification code is: ${verificationCode}\n\nThis code expires in 24 hours.`,
      html: `
        <h1>Email Verification</h1>
        <p>Your new verification code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 4px; background: #f0f0f0; padding: 20px; text-align: center;">${verificationCode}</h2>
        <p>This code expires in 24 hours.</p>
      `
    });

    res.json({ success: true, message: 'Verification code sent' });

  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ error: 'Failed to send verification code', message: err.message });
  }
}

// Forgot password
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await db.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({ success: true, message: 'If an account exists, a reset code has been sent' });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    await db.createPasswordResetCode(user.id, resetCode, expiresAt);

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      to: email,
      subject: 'Reset your EthosLife password',
      text: `Your password reset code is: ${resetCode}\n\nThis code expires in 1 hour.`,
      html: `
        <h1>Password Reset</h1>
        <p>Your password reset code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 4px; background: #f0f0f0; padding: 20px; text-align: center;">${resetCode}</h2>
        <p>This code expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    res.json({ success: true, message: 'If an account exists, a reset code has been sent' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request', message: err.message });
  }
}

// Reset password
async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    const resetCode = await db.getPasswordResetCode(user.id, code);
    if (!resetCode) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }

    // Hash new password
    const password_hash = await hashPassword(newPassword);
    await db.updateUser(user.id, { password_hash });

    // Mark code as used
    await db.markPasswordResetUsed(resetCode.id);

    // Delete all refresh tokens for this user
    await db.deleteUserRefreshTokens(user.id);

    res.json({ success: true, message: 'Password reset successfully. Please login again.' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password', message: err.message });
  }
}

// ============================================================
// GOOGLE OAUTH
// ============================================================

async function googleAuth(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential required' });
    }

    if (!googleClient) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name: fullName, picture: avatarUrl } = payload;

    let result = await db.pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
      await db.pool.query(
        'UPDATE users SET google_id = $1, last_login_at = NOW() WHERE id = $2',
        [googleId, user.id]
      );
    } else {
      const referral_code = generateReferralCode();

      result = await db.pool.query(
        `INSERT INTO users (email, google_id, full_name, avatar_url, last_login_at, referral_code, is_email_verified)
         VALUES ($1, $2, $3, $4, NOW(), $5, true) RETURNING *`,
        [email, googleId, fullName, avatarUrl, referral_code]
      );
      user = result.rows[0];

      await db.pool.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [user.id]);
      console.log(`✅ New user registered via Google: ${email}`);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await db.createRefreshToken(user.id, refreshToken, expiresAt, req.headers['user-agent'], req.ip);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role: user.role,
        isEmailVerified: true,
        subscriptionTier: user.subscription_tier
      },
      token: accessToken,
      refreshToken
    });

  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Authentication failed', message: err.message });
  }
}

// ============================================================
// TELEGRAM AUTH
// ============================================================

async function telegramAuth(req, res) {
  try {
    const { id: telegramId, first_name, last_name, username, photo_url, auth_date, hash } = req.body;

    if (!telegramId || !hash) {
      return res.status(400).json({ error: 'Telegram data required' });
    }

    const dataCheckString = Object.keys(req.body)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${req.body[key]}`)
      .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(TELEGRAM_BOT_TOKEN || '')
      .digest();

    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return res.status(403).json({ error: 'Invalid Telegram authentication' });
    }

    const authDate = parseInt(auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return res.status(403).json({ error: 'Authentication expired' });
    }

    const fullName = `${first_name || ''} ${last_name || ''}`.trim();
    const email = username ? `${username}@telegram.user` : `${telegramId}@telegram.user`;

    let result = await db.pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);

    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
      await db.pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    } else {
      const referral_code = generateReferralCode();

      result = await db.pool.query(
        `INSERT INTO users (email, telegram_id, full_name, avatar_url, last_login_at, referral_code, is_email_verified)
         VALUES ($1, $2, $3, $4, NOW(), $5, true) RETURNING *`,
        [email, telegramId, fullName, photo_url, referral_code]
      );
      user = result.rows[0];

      await db.pool.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [user.id]);
      console.log(`✅ New user registered via Telegram: ${fullName}`);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await db.createRefreshToken(user.id, refreshToken, expiresAt, req.headers['user-agent'], req.ip);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role: user.role,
        isEmailVerified: true,
        subscriptionTier: user.subscription_tier
      },
      token: accessToken,
      refreshToken
    });

  } catch (err) {
    console.error('Telegram auth error:', err);
    res.status(500).json({ error: 'Authentication failed', message: err.message });
  }
}

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const tokenData = await db.getRefreshToken(refreshToken);

    if (!tokenData || !tokenData.is_active) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const tokens = generateTokens(tokenData.user_id);

    await db.deleteRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await db.createRefreshToken(tokenData.user_id, tokens.refreshToken, expiresAt, req.headers['user-agent'], req.ip);

    res.json({
      success: true,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });

  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await db.deleteRefreshToken(refreshToken);
    }

    res.json({ success: true, message: 'Logged out successfully' });

  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
}

async function logoutAll(req, res) {
  try {
    const userId = req.user.id;
    await db.deleteUserRefreshTokens(userId);

    res.json({ success: true, message: 'Logged out from all devices' });

  } catch (err) {
    console.error('Logout all error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
}

// ============================================================
// USER PROFILE
// ============================================================

async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const result = await db.pool.query(
      `SELECT u.id, u.email, u.full_name, u.avatar_url, u.role, u.created_at,
              u.phone, u.date_of_birth, u.gender, u.wallet_address,
              u.subscription_tier, u.subscription_expires, u.referral_code,
              u.referred_by, u.referral_earnings, u.is_email_verified,
              p.bio, p.location
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });

  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to get user data' });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { full_name, phone, date_of_birth, gender, avatar_url, bio, location } = req.body;

    const allowedUpdates = {};
    if (full_name !== undefined) allowedUpdates.full_name = full_name;
    if (phone !== undefined) allowedUpdates.phone = phone;
    if (date_of_birth !== undefined) allowedUpdates.date_of_birth = date_of_birth;
    if (gender !== undefined) allowedUpdates.gender = gender;
    if (avatar_url !== undefined) allowedUpdates.avatar_url = avatar_url;

    await db.updateUser(userId, allowedUpdates);

    // Update profile
    const profileExists = await db.pool.query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileExists.rows.length > 0) {
      const profileUpdates = [];
      const profileValues = [];
      let paramIndex = 1;

      if (bio !== undefined) {
        profileUpdates.push(`bio = $${paramIndex}`);
        profileValues.push(bio);
        paramIndex++;
      }
      if (location !== undefined) {
        profileUpdates.push(`location = $${paramIndex}`);
        profileValues.push(location);
        paramIndex++;
      }

      if (profileUpdates.length > 0) {
        profileValues.push(userId);
        await db.pool.query(
          `UPDATE user_profiles SET ${profileUpdates.join(', ')} WHERE user_id = $${paramIndex}`,
          profileValues
        );
      }
    } else {
      await db.pool.query(
        'INSERT INTO user_profiles (user_id, bio, location) VALUES ($1, $2, $3)',
        [userId, bio, location]
      );
    }

    res.json({ success: true, message: 'Profile updated successfully' });

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const user = await db.pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (!user.rows[0]?.password_hash) {
      return res.status(400).json({ error: 'Cannot change password for OAuth accounts' });
    }

    const isValid = await verifyPassword(currentPassword, user.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const password_hash = await hashPassword(newPassword);
    await db.updateUser(userId, { password_hash });

    // Logout from other devices
    await db.deleteUserRefreshTokens(userId);

    res.json({ success: true, message: 'Password changed successfully. Please login again on other devices.' });

  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
}

// ============================================================
// REFERRALS
// ============================================================

async function getMyReferrals(req, res) {
  try {
    const userId = req.user.id;
    const referrals = await db.getUserReferrals(userId);

    const stats = await db.pool.query(
      `SELECT COUNT(*) as total_referrals,
              COUNT(*) FILTER (WHERE status = 'converted') as converted,
              SUM(earnings) as total_earnings
       FROM referrals WHERE referrer_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      referrals,
      stats: stats.rows[0]
    });

  } catch (err) {
    console.error('Get referrals error:', err);
    res.status(500).json({ error: 'Failed to get referrals' });
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  googleAuth,
  telegramAuth,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  updateProfile,
  changePassword,
  getMyReferrals
};
