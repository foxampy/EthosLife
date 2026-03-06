/**
 * PostgreSQL Database Module for EthosLife SAFT Platform
 * Handles: visits tracking, document storage, submissions
 */

const { Pool } = require('pg');

// Database configuration from environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDatabase() {
  const client = await pool.connect();
  try {
    // Visits/Analytics table
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

    // Page views tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        visit_id INTEGER REFERENCES visits(id) ON DELETE CASCADE,
        page VARCHAR(255) NOT NULL,
        duration_seconds INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // SAFT Submissions
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

    // Documents (SAFT PDFs, generated files)
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

    // Price freeze history
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

// Visit tracking
async function trackVisit(data) {
  const { sessionId, ip, userAgent, country, referrer, page, language } = data;
  const result = await pool.query(
    `INSERT INTO visits (session_id, ip_address, user_agent, country, referrer, page, language)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [sessionId, ip, userAgent, country, referrer, page, language]
  );
  return result.rows[0].id;
}

// Track page view
async function trackPageView(visitId, page, duration = 0) {
  await pool.query(
    `INSERT INTO page_views (visit_id, page, duration_seconds)
     VALUES ($1, $2, $3)`,
    [visitId, page, duration]
  );
}

// Save submission
async function saveSubmission(data) {
  const {
    sessionId,
    investorData,
    investmentAmount,
    pricePerToken,
    tokensAllocated,
    currency,
    walletAddress,
    status,
    priceFrozen,
    freezeExpiresAt
  } = data;

  const result = await pool.query(
    `INSERT INTO submissions 
     (session_id, investor_data, investment_amount, price_per_token, tokens_allocated, 
      currency, wallet_address, status, price_frozen, freeze_expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      sessionId,
      JSON.stringify(investorData),
      investmentAmount,
      pricePerToken,
      tokensAllocated,
      currency,
      walletAddress,
      status,
      priceFrozen,
      freezeExpiresAt
    ]
  );
  return result.rows[0];
}

// Get submission by ID
async function getSubmission(id) {
  const result = await pool.query(
    'SELECT * FROM submissions WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

// Get submission by session
async function getSubmissionBySession(sessionId) {
  const result = await pool.query(
    'SELECT * FROM submissions WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
    [sessionId]
  );
  return result.rows[0];
}

// Get all submissions (for admin)
async function getAllSubmissions(limit = 100, offset = 0) {
  const result = await pool.query(
    `SELECT s.*, 
            d.filename as document_filename,
            d.generated_at as document_generated_at
     FROM submissions s
     LEFT JOIN documents d ON d.submission_id = s.id AND d.type = 'saft_html'
     ORDER BY s.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

// Update submission status
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

// Save document
async function saveDocument(data) {
  const { submissionId, type, filename, contentHtml, contentPdf, fileSize } = data;
  const result = await pool.query(
    `INSERT INTO documents (submission_id, type, filename, content_html, content_pdf, file_size)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [submissionId, type, filename, contentHtml, contentPdf, fileSize]
  );
  return result.rows[0];
}

// Get document
async function getDocument(id) {
  const result = await pool.query(
    'SELECT * FROM documents WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

// Record document download
async function recordDocumentDownload(id) {
  await pool.query(
    `UPDATE documents 
     SET download_count = download_count + 1, downloaded_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id]
  );
}

// Save price freeze
async function savePriceFreeze(sessionId, price, expiresAt, submissionId = null) {
  const result = await pool.query(
    `INSERT INTO price_freezes (session_id, price, expires_at, submission_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [sessionId, price, expiresAt, submissionId]
  );
  return result.rows[0];
}

// Get active price freeze
async function getActivePriceFreeze(sessionId) {
  const result = await pool.query(
    `SELECT * FROM price_freezes 
     WHERE session_id = $1 AND expires_at > CURRENT_TIMESTAMP
     ORDER BY frozen_at DESC LIMIT 1`,
    [sessionId]
  );
  return result.rows[0];
}

// Clean up expired price freezes
async function cleanupExpiredFreezes() {
  const result = await pool.query(
    `DELETE FROM price_freezes WHERE expires_at < CURRENT_TIMESTAMP RETURNING id`
  );
  return result.rowCount;
}

// Analytics queries
async function getVisitStats(startDate, endDate) {
  const result = await pool.query(
    `SELECT 
      COUNT(DISTINCT session_id) as unique_visitors,
      COUNT(*) as total_visits,
      COUNT(DISTINCT country) as countries,
      COUNT(DISTINCT language) as languages
     FROM visits
     WHERE created_at BETWEEN $1 AND $2`,
    [startDate, endDate]
  );
  return result.rows[0];
}

async function getSubmissionsStats(startDate, endDate) {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_submissions,
      SUM(investment_amount) as total_amount,
      SUM(tokens_allocated) as total_tokens,
      status,
      COUNT(*) FILTER (WHERE status = 'pending_review') as pending,
      COUNT(*) FILTER (WHERE status = 'approved') as approved,
      COUNT(*) FILTER (WHERE status = 'rejected') as rejected
     FROM submissions
     WHERE created_at BETWEEN $1 AND $2
     GROUP BY status`,
    [startDate, endDate]
  );
  return result.rows;
}

module.exports = {
  pool,
  initDatabase,
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
