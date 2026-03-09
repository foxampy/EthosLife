/**
 * PostgreSQL Database Module for EthosLife Platform
 * Handles: Users, Health Data, Monetization, Products/Services
 */

const { Pool } = require('pg');

// Database configuration from environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// ============================================================
// INITIALIZATION
// ============================================================

async function initDatabase() {
  const client = await pool.connect();
  try {
    // Visits/Analytics table (legacy SAFT)
    await client.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(64) NOT NULL,
        ip_address INET,
        user_agent TEXT,
        country VARCHAR(2),
        referrer TEXT,
        page VARCHAR(255),
        language VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_visits_session ON visits(session_id);
      CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        visit_id INTEGER REFERENCES visits(id) ON DELETE CASCADE,
        page VARCHAR(255) NOT NULL,
        duration_seconds INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(64) NOT NULL,
        investor_data JSONB NOT NULL,
        investment_amount DECIMAL(12,2) NOT NULL,
        price_per_token DECIMAL(10,6) NOT NULL,
        tokens_allocated BIGINT NOT NULL,
        currency VARCHAR(10) DEFAULT 'USDC',
        wallet_address VARCHAR(42) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending_review',
        price_frozen BOOLEAN DEFAULT false,
        freeze_expires_at TIMESTAMP,
        telegram_message_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_submissions_session ON submissions(session_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
      CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        content_html TEXT,
        content_pdf BYTEA,
        file_size INTEGER,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        downloaded_at TIMESTAMP,
        download_count INTEGER DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_documents_submission ON documents(submission_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS price_freezes (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(64) NOT NULL,
        price DECIMAL(10,6) NOT NULL,
        frozen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL
      );
      CREATE INDEX IF NOT EXISTS idx_freezes_session ON price_freezes(session_id);
      CREATE INDEX IF NOT EXISTS idx_freezes_expires ON price_freezes(expires_at);
    `);

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    throw err;
  } finally {
    client.release();
  }
}

// ============================================================
// USERS
// ============================================================

async function createUser(userData) {
  const {
    email,
    password_hash,
    full_name,
    avatar_url,
    phone,
    date_of_birth,
    gender,
    wallet_address,
    referral_code,
    referred_by
  } = userData;

  const result = await pool.query(
    `INSERT INTO users 
     (email, password_hash, full_name, avatar_url, phone, date_of_birth, gender, 
      wallet_address, referral_code, referred_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [email, password_hash, full_name, avatar_url, phone, date_of_birth, gender, 
     wallet_address, referral_code, referred_by]
  );
  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query(
    `SELECT id, email, full_name, avatar_url, phone, date_of_birth, gender,
            subscription_tier, subscription_expires, wallet_address,
            referral_code, referred_by, referral_earnings,
            is_active, is_email_verified, email_verified_at, last_login_at,
            created_at, updated_at, role
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  return result.rows[0];
}

async function getUserByWallet(walletAddress) {
  const result = await pool.query(
    'SELECT * FROM users WHERE wallet_address = $1',
    [walletAddress.toLowerCase()]
  );
  return result.rows[0];
}

async function updateUser(id, updates) {
  const allowedFields = [
    'full_name', 'avatar_url', 'phone', 'date_of_birth', 'gender',
    'subscription_tier', 'subscription_expires', 'stripe_customer_id', 'stripe_subscription_id',
    'wallet_address', 'is_active', 'is_email_verified', 'email_verified_at', 'last_login_at',
    'password_hash', 'password_reset_token', 'password_reset_expires', 'email_verification_token'
  ];
  
  const setClause = [];
  const values = [];
  let paramIndex = 1;
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      setClause.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }
  
  if (setClause.length === 0) return null;
  
  values.push(id);
  const result = await pool.query(
    `UPDATE users SET ${setClause.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
}

async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return true;
}

async function listUsers(options = {}) {
  const { limit = 50, offset = 0, search, subscription_tier, is_active } = options;
  let whereClause = [];
  const values = [];
  let paramIndex = 1;
  
  if (search) {
    whereClause.push(`(email ILIKE $${paramIndex} OR full_name ILIKE $${paramIndex})`);
    values.push(`%${search}%`);
    paramIndex++;
  }
  
  if (subscription_tier) {
    whereClause.push(`subscription_tier = $${paramIndex}`);
    values.push(subscription_tier);
    paramIndex++;
  }
  
  if (is_active !== undefined) {
    whereClause.push(`is_active = $${paramIndex}`);
    values.push(is_active);
    paramIndex++;
  }
  
  const whereStr = whereClause.length > 0 ? 'WHERE ' + whereClause.join(' AND ') : '';
  values.push(limit, offset);
  
  const result = await pool.query(
    `SELECT id, email, full_name, avatar_url, subscription_tier, is_active, created_at 
     FROM users ${whereStr} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    values
  );
  
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM users ${whereStr}`,
    values.slice(0, -2)
  );
  
  return {
    users: result.rows,
    total: parseInt(countResult.rows[0].count),
    limit,
    offset
  };
}

// ============================================================
// REFRESH TOKENS
// ============================================================

async function createRefreshToken(userId, token, expiresAt, deviceInfo, ipAddress) {
  const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
  const result = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, token_hash, expires_at, device_info, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, token, tokenHash, expiresAt, deviceInfo, ipAddress]
  );
  return result.rows[0];
}

async function getRefreshToken(token) {
  const result = await pool.query(
    `SELECT rt.*, u.is_active, u.id as user_id 
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.id
     WHERE rt.token = $1 AND rt.expires_at > NOW()`,
    [token]
  );
  return result.rows[0];
}

async function deleteRefreshToken(token) {
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  return true;
}

async function deleteUserRefreshTokens(userId, exceptToken = null) {
  if (exceptToken) {
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1 AND token != $2', [userId, exceptToken]);
  } else {
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  }
  return true;
}

// ============================================================
// VERIFICATION CODES
// ============================================================

async function createEmailVerificationCode(userId, code, expiresAt) {
  await pool.query('DELETE FROM email_verification_codes WHERE user_id = $1', [userId]);
  const result = await pool.query(
    `INSERT INTO email_verification_codes (user_id, code, expires_at)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, code, expiresAt]
  );
  return result.rows[0];
}

async function getEmailVerificationCode(userId, code) {
  const result = await pool.query(
    `SELECT * FROM email_verification_codes 
     WHERE user_id = $1 AND code = $2 AND expires_at > NOW()`,
    [userId, code]
  );
  return result.rows[0];
}

async function incrementCodeAttempts(id) {
  await pool.query(
    'UPDATE email_verification_codes SET attempts = attempts + 1 WHERE id = $1',
    [id]
  );
}

async function deleteEmailVerificationCode(id) {
  await pool.query('DELETE FROM email_verification_codes WHERE id = $1', [id]);
}

async function createPasswordResetCode(userId, code, expiresAt) {
  await pool.query('DELETE FROM password_reset_codes WHERE user_id = $1', [userId]);
  const result = await pool.query(
    `INSERT INTO password_reset_codes (user_id, code, expires_at)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, code, expiresAt]
  );
  return result.rows[0];
}

async function getPasswordResetCode(userId, code) {
  const result = await pool.query(
    `SELECT * FROM password_reset_codes 
     WHERE user_id = $1 AND code = $2 AND expires_at > NOW() AND used_at IS NULL`,
    [userId, code]
  );
  return result.rows[0];
}

async function markPasswordResetUsed(id) {
  await pool.query('UPDATE password_reset_codes SET used_at = NOW() WHERE id = $1', [id]);
}

// ============================================================
// DAILY METRICS
// ============================================================

async function createOrUpdateDailyMetrics(userId, date, metrics) {
  const fields = Object.keys(metrics);
  const values = Object.values(metrics);
  
  const setClause = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');
  
  const result = await pool.query(
    `INSERT INTO daily_metrics (user_id, date, ${fields.join(', ')})
     VALUES ($1, $2, ${fields.map((_, i) => `$${i + 3}`).join(', ')})
     ON CONFLICT (user_id, date) DO UPDATE SET
     ${setClause}, updated_at = NOW()
     RETURNING *`,
    [userId, date, ...values]
  );
  return result.rows[0];
}

async function getDailyMetrics(userId, date) {
  const result = await pool.query(
    'SELECT * FROM daily_metrics WHERE user_id = $1 AND date = $2',
    [userId, date]
  );
  return result.rows[0];
}

async function getDailyMetricsRange(userId, startDate, endDate) {
  const result = await pool.query(
    `SELECT * FROM daily_metrics 
     WHERE user_id = $1 AND date BETWEEN $2 AND $3
     ORDER BY date DESC`,
    [userId, startDate, endDate]
  );
  return result.rows;
}

// ============================================================
// MOOD ENTRIES
// ============================================================

async function createMoodEntry(userId, data) {
  const { mood_score, stress_level, energy_level, notes } = data;
  const result = await pool.query(
    `INSERT INTO mood_entries (user_id, mood_score, stress_level, energy_level, notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, mood_score, stress_level, energy_level, notes]
  );
  return result.rows[0];
}

async function getMoodEntries(userId, limit = 30, offset = 0) {
  const result = await pool.query(
    `SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

// ============================================================
// HABITS
// ============================================================

async function createHabit(userId, data) {
  const { name, category, frequency, target_count, reminder_time } = data;
  const result = await pool.query(
    `INSERT INTO habits (user_id, name, category, frequency, target_count, reminder_time)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, name, category, frequency, target_count, reminder_time]
  );
  return result.rows[0];
}

async function getUserHabits(userId, isActive = true) {
  const result = await pool.query(
    `SELECT h.*, 
            (SELECT COUNT(*) FROM habit_completions WHERE habit_id = h.id AND completed_at > NOW() - INTERVAL '7 days') as completions_7d
     FROM habits h WHERE h.user_id = $1 AND h.is_active = $2
     ORDER BY h.created_at DESC`,
    [userId, isActive]
  );
  return result.rows;
}

async function updateHabit(id, userId, updates) {
  const allowedFields = ['name', 'category', 'frequency', 'target_count', 'reminder_time', 'is_active'];
  const setClause = [];
  const values = [];
  let paramIndex = 1;
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      setClause.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }
  
  if (setClause.length === 0) return null;
  values.push(id, userId);
  
  const result = await pool.query(
    `UPDATE habits SET ${setClause.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`,
    values
  );
  return result.rows[0];
}

async function deleteHabit(id, userId) {
  await pool.query('DELETE FROM habits WHERE id = $1 AND user_id = $2', [id, userId]);
  return true;
}

async function completeHabit(habitId, userId, notes) {
  const result = await pool.query(
    `INSERT INTO habit_completions (habit_id, user_id, notes) VALUES ($1, $2, $3) RETURNING *`,
    [habitId, userId, notes]
  );
  return result.rows[0];
}

async function getHabitCompletions(habitId, userId, days = 30) {
  const result = await pool.query(
    `SELECT * FROM habit_completions 
     WHERE habit_id = $1 AND user_id = $2 
     AND completed_at > NOW() - INTERVAL '${days} days'
     ORDER BY completed_at DESC`,
    [habitId, userId]
  );
  return result.rows;
}

// ============================================================
// WORKOUTS
// ============================================================

async function createWorkout(userId, data) {
  const { type, duration_minutes, calories_burned, intensity, exercises, notes, started_at, completed_at } = data;
  const result = await pool.query(
    `INSERT INTO workouts (user_id, type, duration_minutes, calories_burned, intensity, exercises, notes, started_at, completed_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [userId, type, duration_minutes, calories_burned, intensity, JSON.stringify(exercises || []), notes, started_at, completed_at]
  );
  return result.rows[0];
}

async function getUserWorkouts(userId, limit = 20, offset = 0) {
  const result = await pool.query(
    `SELECT * FROM workouts WHERE user_id = $1 ORDER BY completed_at DESC NULLS LAST LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

// ============================================================
// MEALS
// ============================================================

async function createMeal(userId, data) {
  const { name, meal_type, calories, protein_g, carbs_g, fat_g, fiber_g, photo_url, logged_at } = data;
  const result = await pool.query(
    `INSERT INTO meals (user_id, name, meal_type, calories, protein_g, carbs_g, fat_g, fiber_g, photo_url, logged_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [userId, name, meal_type, calories, protein_g, carbs_g, fat_g, fiber_g, photo_url, logged_at || new Date()]
  );
  return result.rows[0];
}

async function getUserMeals(userId, date, limit = 50) {
  let query = 'SELECT * FROM meals WHERE user_id = $1';
  const values = [userId];
  
  if (date) {
    query += ' AND DATE(logged_at) = $2';
    values.push(date);
  }
  
  query += ` ORDER BY logged_at DESC LIMIT $${values.length + 1}`;
  values.push(limit);
  
  const result = await pool.query(query, values);
  return result.rows;
}

// ============================================================
// SUBSCRIPTIONS
// ============================================================

async function createSubscription(data) {
  const { user_id, stripe_subscription_id, stripe_price_id, tier, status, current_period_start, current_period_end } = data;
  const result = await pool.query(
    `INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_price_id, tier, status, current_period_start, current_period_end)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [user_id, stripe_subscription_id, stripe_price_id, tier, status, current_period_start, current_period_end]
  );
  return result.rows[0];
}

async function getUserSubscription(userId) {
  const result = await pool.query(
    `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0];
}

async function updateSubscriptionStatus(id, status, cancelAtPeriodEnd = null) {
  const updates = ['status = $2'];
  const values = [id, status];
  
  if (cancelAtPeriodEnd !== null) {
    updates.push('cancel_at_period_end = $3');
    values.push(cancelAtPeriodEnd);
  }
  
  const result = await pool.query(
    `UPDATE subscriptions SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
    values
  );
  return result.rows[0];
}

// ============================================================
// TRANSACTIONS
// ============================================================

async function createTransaction(data) {
  const { user_id, type, amount, currency, stripe_payment_intent_id, status, metadata } = data;
  const result = await pool.query(
    `INSERT INTO transactions (user_id, type, amount, currency, stripe_payment_intent_id, status, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [user_id, type, amount, currency || 'USD', stripe_payment_intent_id, status, JSON.stringify(metadata || {})]
  );
  return result.rows[0];
}

async function getUserTransactions(userId, limit = 50, offset = 0) {
  const result = await pool.query(
    `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

// ============================================================
// PRODUCTS
// ============================================================

async function getProducts(options = {}) {
  const { category, type, is_active = true, search, limit = 50, offset = 0 } = options;
  let whereClause = ['is_active = $1'];
  const values = [is_active];
  let paramIndex = 2;
  
  if (category) {
    whereClause.push(`category = $${paramIndex}`);
    values.push(category);
    paramIndex++;
  }
  
  if (type) {
    whereClause.push(`type = $${paramIndex}`);
    values.push(type);
    paramIndex++;
  }
  
  if (search) {
    whereClause.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    values.push(`%${search}%`);
    paramIndex++;
  }
  
  const whereStr = whereClause.join(' AND ');
  values.push(limit, offset);
  
  const result = await pool.query(
    `SELECT * FROM products WHERE ${whereStr} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    values
  );
  
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM products WHERE ${whereStr}`,
    values.slice(0, -2)
  );
  
  return {
    products: result.rows,
    total: parseInt(countResult.rows[0].count),
    limit,
    offset
  };
}

async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}

// ============================================================
// SPECIALISTS
// ============================================================

async function getSpecialists(options = {}) {
  const { specialization, is_verified, is_active = true, limit = 50, offset = 0 } = options;
  let whereClause = ['is_active = $1'];
  const values = [is_active];
  let paramIndex = 2;
  
  if (specialization) {
    whereClause.push(`$${paramIndex} = ANY(specializations)`);
    values.push(specialization);
    paramIndex++;
  }
  
  if (is_verified !== undefined) {
    whereClause.push(`is_verified = $${paramIndex}`);
    values.push(is_verified);
    paramIndex++;
  }
  
  const whereStr = whereClause.join(' AND ');
  values.push(limit, offset);
  
  const result = await pool.query(
    `SELECT s.*, u.full_name, u.avatar_url 
     FROM specialists s
     JOIN users u ON s.user_id = u.id
     WHERE ${whereStr} ORDER BY s.rating DESC, s.reviews_count DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    values
  );
  
  return result.rows;
}

async function getSpecialistById(id) {
  const result = await pool.query(
    `SELECT s.*, u.full_name, u.avatar_url, u.email
     FROM specialists s
     JOIN users u ON s.user_id = u.id
     WHERE s.id = $1`,
    [id]
  );
  return result.rows[0];
}

// ============================================================
// REFERRALS
// ============================================================

async function createReferral(referrerId, referredId, codeUsed) {
  const result = await pool.query(
    `INSERT INTO referrals (referrer_id, referred_id, code_used) VALUES ($1, $2, $3) RETURNING *`,
    [referrerId, referredId, codeUsed]
  );
  return result.rows[0];
}

async function getReferralByReferredId(referredId) {
  const result = await pool.query(
    'SELECT * FROM referrals WHERE referred_id = $1',
    [referredId]
  );
  return result.rows[0];
}

async function updateReferralStatus(id, status, earnings) {
  const result = await pool.query(
    `UPDATE referrals SET status = $2, earnings = $3, converted_at = NOW() WHERE id = $1 RETURNING *`,
    [id, status, earnings]
  );
  return result.rows[0];
}

async function getUserReferrals(userId) {
  const result = await pool.query(
    `SELECT r.*, u.full_name as referred_name, u.email as referred_email
     FROM referrals r
     JOIN users u ON r.referred_id = u.id
     WHERE r.referrer_id = $1 ORDER BY r.created_at DESC`,
    [userId]
  );
  return result.rows;
}

// ============================================================
// LEGACY SAFT FUNCTIONS
// ============================================================

async function trackVisit(data) {
  const { sessionId, ip, userAgent, country, referrer, page, language } = data;
  const result = await pool.query(
    `INSERT INTO visits (session_id, ip_address, user_agent, country, referrer, page, language)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [sessionId, ip, userAgent, country, referrer, page, language]
  );
  return result.rows[0].id;
}

async function trackPageView(visitId, page, duration = 0) {
  await pool.query(
    `INSERT INTO page_views (visit_id, page, duration_seconds) VALUES ($1, $2, $3)`,
    [visitId, page, duration]
  );
}

async function saveSubmission(data) {
  const {
    sessionId, investorData, investmentAmount, pricePerToken, tokensAllocated,
    currency, walletAddress, status, priceFrozen, freezeExpiresAt
  } = data;

  const result = await pool.query(
    `INSERT INTO submissions 
     (session_id, investor_data, investment_amount, price_per_token, tokens_allocated, 
      currency, wallet_address, status, price_frozen, freeze_expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      sessionId, JSON.stringify(investorData), investmentAmount, pricePerToken, tokensAllocated,
      currency, walletAddress, status, priceFrozen, freezeExpiresAt
    ]
  );
  return result.rows[0];
}

async function getSubmission(id) {
  const result = await pool.query('SELECT * FROM submissions WHERE id = $1', [id]);
  return result.rows[0];
}

async function getSubmissionBySession(sessionId) {
  const result = await pool.query(
    'SELECT * FROM submissions WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
    [sessionId]
  );
  return result.rows[0];
}

async function getAllSubmissions(limit = 100, offset = 0) {
  const result = await pool.query(
    `SELECT s.*, d.filename as document_filename, d.generated_at as document_generated_at
     FROM submissions s
     LEFT JOIN documents d ON d.submission_id = s.id AND d.type = 'saft_html'
     ORDER BY s.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

async function updateSubmissionStatus(id, status, telegramMessageId = null) {
  const updates = ['status = $2', 'updated_at = CURRENT_TIMESTAMP'];
  const values = [id, status];
  
  if (telegramMessageId) {
    updates.push('telegram_message_id = $3');
    values.push(telegramMessageId);
  }

  const result = await pool.query(
    `UPDATE submissions SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
    values
  );
  return result.rows[0];
}

async function saveDocument(data) {
  const { submissionId, type, filename, contentHtml, contentPdf, fileSize } = data;
  const result = await pool.query(
    `INSERT INTO documents (submission_id, type, filename, content_html, content_pdf, file_size)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [submissionId, type, filename, contentHtml, contentPdf, fileSize]
  );
  return result.rows[0];
}

async function getDocument(id) {
  const result = await pool.query('SELECT * FROM documents WHERE id = $1', [id]);
  return result.rows[0];
}

async function recordDocumentDownload(id) {
  await pool.query(
    `UPDATE documents SET download_count = download_count + 1, downloaded_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [id]
  );
}

async function savePriceFreeze(sessionId, price, expiresAt, submissionId = null) {
  const result = await pool.query(
    `INSERT INTO price_freezes (session_id, price, expires_at, submission_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [sessionId, price, expiresAt, submissionId]
  );
  return result.rows[0];
}

async function getActivePriceFreeze(sessionId) {
  const result = await pool.query(
    `SELECT * FROM price_freezes WHERE session_id = $1 AND expires_at > CURRENT_TIMESTAMP ORDER BY frozen_at DESC LIMIT 1`,
    [sessionId]
  );
  return result.rows[0];
}

async function cleanupExpiredFreezes() {
  const result = await pool.query(`DELETE FROM price_freezes WHERE expires_at < CURRENT_TIMESTAMP RETURNING id`);
  return result.rowCount;
}

// ============================================================
// ANALYTICS
// ============================================================

async function getVisitStats(startDate, endDate) {
  const result = await pool.query(
    `SELECT COUNT(DISTINCT session_id) as unique_visitors, COUNT(*) as total_visits,
            COUNT(DISTINCT country) as countries, COUNT(DISTINCT language) as languages
     FROM visits WHERE created_at BETWEEN $1 AND $2`,
    [startDate, endDate]
  );
  return result.rows[0];
}

async function getSubmissionsStats(startDate, endDate) {
  const result = await pool.query(
    `SELECT COUNT(*) as total_submissions, SUM(investment_amount) as total_amount,
            SUM(tokens_allocated) as total_tokens, status,
            COUNT(*) FILTER (WHERE status = 'pending_review') as pending,
            COUNT(*) FILTER (WHERE status = 'approved') as approved,
            COUNT(*) FILTER (WHERE status = 'rejected') as rejected
     FROM submissions WHERE created_at BETWEEN $1 AND $2 GROUP BY status`,
    [startDate, endDate]
  );
  return result.rows;
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  pool,
  initDatabase,
  
  // Users
  createUser,
  getUserById,
  getUserByEmail,
  getUserByWallet,
  updateUser,
  deleteUser,
  listUsers,
  
  // Tokens
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  deleteUserRefreshTokens,
  
  // Verification
  createEmailVerificationCode,
  getEmailVerificationCode,
  incrementCodeAttempts,
  deleteEmailVerificationCode,
  createPasswordResetCode,
  getPasswordResetCode,
  markPasswordResetUsed,
  
  // Health Data
  createOrUpdateDailyMetrics,
  getDailyMetrics,
  getDailyMetricsRange,
  createMoodEntry,
  getMoodEntries,
  
  // Habits
  createHabit,
  getUserHabits,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitCompletions,
  
  // Workouts
  createWorkout,
  getUserWorkouts,
  
  // Meals
  createMeal,
  getUserMeals,
  
  // Subscriptions
  createSubscription,
  getUserSubscription,
  updateSubscriptionStatus,
  
  // Transactions
  createTransaction,
  getUserTransactions,
  
  // Products
  getProducts,
  getProductById,
  
  // Specialists
  getSpecialists,
  getSpecialistById,
  
  // Referrals
  createReferral,
  getReferralByReferredId,
  updateReferralStatus,
  getUserReferrals,
  
  // Legacy SAFT
  trackVisit,
  trackPageView,
  saveSubmission,
  getSubmission,
  getSubmissionBySession,
  getAllSubmissions,
  updateSubmissionStatus,
  saveDocument,
  getDocument,
  recordDocumentDownload,
  savePriceFreeze,
  getActivePriceFreeze,
  cleanupExpiredFreezes,
  getVisitStats,
  getSubmissionsStats
};
