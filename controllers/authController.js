/**
 * Auth Controller - Google OAuth, Telegram Auth, JWT
 */

const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const db = require('../database');
const { generateTokens } = require('../middleware/auth');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Google OAuth Login/Register
async function googleAuth(req, res) {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ error: 'Google credential required' });
    }
    
    if (!googleClient) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }
    
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name: fullName, picture: avatarUrl } = payload;
    
    // Check if user exists
    let result = await db.pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );
    
    let user;
    
    if (result.rows.length > 0) {
      // Update existing user
      user = result.rows[0];
      await db.pool.query(
        'UPDATE users SET google_id = $1, last_login = CURRENT_TIMESTAMP WHERE id = $2',
        [googleId, user.id]
      );
    } else {
      // Create new user
      result = await db.pool.query(
        `INSERT INTO users (email, google_id, full_name, avatar_url, last_login)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING *`,
        [email, googleId, fullName, avatarUrl]
      );
      user = result.rows[0];
      
      // Create empty profile
      await db.pool.query(
        'INSERT INTO user_profiles (user_id) VALUES ($1)',
        [user.id]
      );
      
      console.log(`✅ New user registered via Google: ${email}`);
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await db.pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role: user.role
      },
      token: accessToken,
      refreshToken
    });
    
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Authentication failed', message: err.message });
  }
}

// Telegram Auth
async function telegramAuth(req, res) {
  try {
    const { id: telegramId, first_name, last_name, username, photo_url, auth_date, hash } = req.body;
    
    if (!telegramId || !hash) {
      return res.status(400).json({ error: 'Telegram data required' });
    }
    
    // Verify Telegram hash
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
    
    // Check auth_date (should be within 24 hours)
    const authDate = parseInt(auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return res.status(403).json({ error: 'Authentication expired' });
    }
    
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();
    const email = username ? `${username}@telegram.user` : `${telegramId}@telegram.user`;
    
    // Check if user exists
    let result = await db.pool.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramId]
    );
    
    let user;
    
    if (result.rows.length > 0) {
      user = result.rows[0];
      await db.pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );
    } else {
      result = await db.pool.query(
        `INSERT INTO users (email, telegram_id, full_name, avatar_url, last_login)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING *`,
        [email, telegramId, fullName, photo_url]
      );
      user = result.rows[0];
      
      await db.pool.query(
        'INSERT INTO user_profiles (user_id) VALUES ($1)',
        [user.id]
      );
      
      console.log(`✅ New user registered via Telegram: ${fullName}`);
    }
    
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await db.pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        role: user.role
      },
      token: accessToken,
      refreshToken
    });
    
  } catch (err) {
    console.error('Telegram auth error:', err);
    res.status(500).json({ error: 'Authentication failed', message: err.message });
  }
}

// Refresh token
async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    // Check if token exists and not expired
    const result = await db.pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP',
      [refreshToken]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
    
    const tokenData = result.rows[0];
    
    // Generate new tokens
    const tokens = generateTokens(tokenData.user_id);
    
    // Delete old token
    await db.pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    
    // Save new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await db.pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [tokenData.user_id, tokens.refreshToken, expiresAt]
    );
    
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

// Logout
async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await db.pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
    
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
}

// Get current user
async function getMe(req, res) {
  try {
    const userId = req.user.id;
    
    const result = await db.pool.query(
      `SELECT u.id, u.email, u.full_name, u.avatar_url, u.role, u.created_at,
              p.bio, p.location, p.birth_date, p.gender, p.phone
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: result.rows[0]
    });
    
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to get user data' });
  }
}

module.exports = {
  googleAuth,
  telegramAuth,
  refreshToken,
  logout,
  getMe
};
