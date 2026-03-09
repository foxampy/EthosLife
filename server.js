/**
 * EthosLife SAFT Platform Server
 * - Dynamic pricing from $0.01 to $0.05 until March 10, 2025 01:00 UTC
 * - Price freeze for 1 hour after form submission
 * - Telegram bot notifications
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');
const { generateSAFTHTML } = require('./pdf-generator');
const db = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const aiRoutes = require('./routes/ai');
const subscriptionRoutes = require('./routes/subscriptions');
const referralRoutes = require('./routes/referrals');
const cashbackRoutes = require('./routes/cashback');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const specialistsRoutes = require('./routes/specialists');
const centersRoutes = require('./routes/centers');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables helper
function getEnv(name, required = false) {
  const value = process.env[name];
  if (!value && required && process.env.NODE_ENV === 'production') {
    console.error(`❌ ERROR: Required environment variable ${name} is not set!`);
    process.exit(1);
  }
  return value;
}

// Configuration
const CONFIG = {
  // Pricing - Динамическое ценообразование
  START_PRICE: 0.01,
  END_PRICE: 0.05,
  // Начало отсчёта - момент первого деплоя
  START_DATE: new Date('2026-03-06T09:00:00Z'),
  // Конец - 10 марта 2026 01:00 UTC
  END_DATE: new Date('2026-03-10T01:00:00Z'),
  
  // Price freeze duration (1 hour в миллисекундах)
  FREEZE_DURATION_MS: 60 * 60 * 1000,
  
  // Telegram - опционально (приложение работает без бота)
  TELEGRAM_BOT_TOKEN: getEnv('TELEGRAM_BOT_TOKEN'),
  FOUNDER_CHAT_ID: getEnv('FOUNDER_CHAT_ID'),
  ADMIN_CHAT_IDS: process.env.ADMIN_CHAT_IDS ? process.env.ADMIN_CHAT_IDS.split(',') : [],
  
  // Investment limits
  MIN_INVESTMENT: 5000,
  MAX_INVESTMENT_STANDARD: 50000,
  MAX_INVESTMENT_STRATEGIC: 500000,
  
  // Security
  ADMIN_KEY: process.env.ADMIN_KEY || 'default-admin-key-change-in-production'
};

// In-memory cache (PostgreSQL is primary storage)
const priceFreezes = new Map(); // sessionId -> { price, expiresAt }
const submissions = new Map();  // sessionId -> submission data (cache)

// Initialize Telegram Bot
let bot = null;
if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_BOT_TOKEN !== 'your_bot_token_here') {
  try {
    bot = new TelegramBot(CONFIG.TELEGRAM_BOT_TOKEN, { polling: true });
    console.log('🤖 Telegram bot initialized');
    
    // Handle /start command
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 
        '👋 Welcome to EthosLife SAFT Bot!\n\n' +
        'Use this bot to receive SAFT agreements.\n' +
        'Your Chat ID: ' + chatId
      );
    });
  } catch (err) {
    console.error('❌ Failed to initialize Telegram bot:', err.message);
  }
} else {
  console.log('ℹ️ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and FOUNDER_CHAT_ID env vars to enable.');
}

// Middleware
// CORS configuration for Vercel frontend
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:3000', 'http://localhost:5173', 'https://ethoslife.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key']
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Static files - SAFT form available at /saft
app.use('/saft', express.static('public'));
app.use('/i18n.js', express.static('public/i18n.js'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api', referralRoutes);
app.use('/api', cashbackRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/specialists', specialistsRoutes);
app.use('/api/centers', centersRoutes);

// Stripe Webhook endpoint (needs raw body)
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const { handleWebhook } = require('./webhooks/stripe');
  await handleWebhook(req, res);
});

// Serve React Frontend (Production) - AFTER API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/dist'));
  
  // All non-API routes go to React app
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/saft/')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile('frontend/dist/index.html', { root: process.cwd() });
  });
}

// ==================== DATABASE INIT ====================

// Initialize database on startup
let dbInitialized = false;

async function initApp() {
  try {
    await db.initDatabase();
    dbInitialized = true;
    console.log('✅ Database connected and initialized');
  } catch (err) {
    console.error('⚠️ Database initialization failed:', err.message);
    console.log('⚠️ Running in memory-only mode');
  }
}

// ==================== PRICE CALCULATION ====================

/**
 * Calculate current token price based on time
 * Linear interpolation from START_PRICE to END_PRICE
 */
function getCurrentPrice() {
  const now = new Date();
  
  if (now >= CONFIG.END_DATE) {
    return CONFIG.END_PRICE;
  }
  
  if (now <= CONFIG.START_DATE) {
    return CONFIG.START_PRICE;
  }
  
  const totalDuration = CONFIG.END_DATE - CONFIG.START_DATE;
  const elapsed = now - CONFIG.START_DATE;
  const progress = elapsed / totalDuration;
  
  const price = CONFIG.START_PRICE + (CONFIG.END_PRICE - CONFIG.START_PRICE) * progress;
  return Math.round(price * 10000) / 10000; // Round to 4 decimal places
}

/**
 * Get price for a specific session
 * Respects price freeze after form submission
 */
function getSessionPrice(sessionId) {
  const freeze = priceFreezes.get(sessionId);
  
  if (freeze && new Date() < new Date(freeze.expiresAt)) {
    return {
      price: freeze.price,
      frozen: true,
      expiresAt: freeze.expiresAt
    };
  }
  
  // Clear expired freeze
  if (freeze) {
    priceFreezes.delete(sessionId);
  }
  
  return {
    price: getCurrentPrice(),
    frozen: false,
    expiresAt: null
  };
}

/**
 * Freeze price for a session
 */
function freezePrice(sessionId, price) {
  const expiresAt = new Date(Date.now() + CONFIG.FREEZE_DURATION_MS);
  priceFreezes.set(sessionId, {
    price,
    expiresAt: expiresAt.toISOString()
  });
  return expiresAt;
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    currentPrice: getCurrentPrice()
  });
});

// Root route - API info (React app is served separately by ethoslife-web service)
app.get('/', (req, res) => {
  res.json({
    name: 'EthosLife API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      health: '/api/health',
      price: '/api/price',
      saft: '/saft'
    },
    message: 'Frontend available at ethoslife-web service'
  });
});

// Track visit middleware
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }
  
  try {
    const sessionId = req.headers['x-session-id'] || uuidv4();
    const visitData = {
      sessionId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      country: req.headers['cf-ipcountry'] || req.headers['x-country'],
      referrer: req.headers.referer,
      page: req.path,
      language: req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'en'
    };
    
    if (dbInitialized) {
      await db.trackVisit(visitData);
    }
  } catch (err) {
    // Silently fail tracking
  }
  
  next();
});

// Get current price info
app.get('/api/price', async (req, res) => {
  const sessionId = req.query.sessionId || uuidv4();
  let priceInfo = getSessionPrice(sessionId);
  
  // Check database for active freeze
  if (dbInitialized && !priceInfo.frozen) {
    try {
      const dbFreeze = await db.getActivePriceFreeze(sessionId);
      if (dbFreeze) {
        priceInfo = {
          price: parseFloat(dbFreeze.price),
          frozen: true,
          expiresAt: dbFreeze.expires_at
        };
        priceFreezes.set(sessionId, priceInfo);
      }
    } catch (err) {
      console.error('DB error:', err);
    }
  }
  
  res.json({
    currentPrice: priceInfo.price,
    frozen: priceInfo.frozen,
    freezeExpiresAt: priceInfo.expiresAt,
    sessionId,
    startPrice: CONFIG.START_PRICE,
    endPrice: CONFIG.END_PRICE,
    endDate: CONFIG.END_DATE.toISOString(),
    timeRemaining: Math.max(0, CONFIG.END_DATE - new Date())
  });
});

// Calculate tokens for investment amount
app.post('/api/calculate', (req, res) => {
  const { amount, sessionId } = req.body;
  const sid = sessionId || uuidv4();
  
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  
  const investment = parseFloat(amount);
  
  if (investment < CONFIG.MIN_INVESTMENT) {
    return res.status(400).json({ 
      error: `Minimum investment is $${CONFIG.MIN_INVESTMENT}` 
    });
  }
  
  const priceInfo = getSessionPrice(sid);
  const tokens = Math.floor(investment / priceInfo.price);
  
  res.json({
    investment: investment,
    pricePerToken: priceInfo.price,
    tokensAllocated: tokens,
    frozen: priceInfo.frozen,
    freezeExpiresAt: priceInfo.expiresAt,
    sessionId: sid
  });
});

// Validation middleware
function validateSubmission(req, res, next) {
  const { investorData, investmentAmount, walletAddress } = req.body;
  const errors = [];
  
  // Validate investment amount
  if (!investmentAmount || isNaN(investmentAmount)) {
    errors.push('Investment amount is required');
  } else if (investmentAmount < CONFIG.MIN_INVESTMENT) {
    errors.push(`Minimum investment is $${CONFIG.MIN_INVESTMENT.toLocaleString()}`);
  } else if (investmentAmount > CONFIG.MAX_INVESTMENT_STRATEGIC) {
    errors.push(`Maximum investment is $${CONFIG.MAX_INVESTMENT_STRATEGIC.toLocaleString()}`);
  }
  
  // Validate investor data
  if (!investorData) {
    errors.push('Investor data is required');
  } else {
    const required = ['fullName', 'email', 'phone', 'address', 'nationality', 'passportNumber', 'issuedBy', 'dob'];
    for (const field of required) {
      if (!investorData[field] || investorData[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    }
    
    // Email validation
    if (investorData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(investorData.email)) {
      errors.push('Invalid email format');
    }
  }
  
  // Validate wallet address
  if (!walletAddress) {
    errors.push('Wallet address is required');
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    errors.push('Invalid Ethereum wallet address');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }
  
  next();
}

// Submit SAFT form
app.post('/api/submit-saft', validateSubmission, async (req, res) => {
  const { 
    sessionId, 
    investorData, 
    investmentAmount,
    currency,
    walletAddress
  } = req.body;
  
  const priceInfo = getSessionPrice(sessionId);
  const tokens = Math.floor(investmentAmount / priceInfo.price);
  
  // Freeze the price
  const freezeExpiresAt = freezePrice(sessionId, priceInfo.price);
  
  // Create submission record
  const submissionId = uuidv4();
  const submission = {
    id: submissionId,
    sessionId,
    submittedAt: new Date().toISOString(),
    investorData: {
      ...investorData,
      investorStatus: investorData.investorStatus || 'individual'
    },
    investmentAmount: parseFloat(investmentAmount),
    pricePerToken: priceInfo.price,
    tokensAllocated: tokens,
    currency: currency || 'USDC',
    walletAddress,
    status: 'pending_review',
    priceFrozen: true
  };
  
  // Save to memory cache
  submissions.set(sessionId, submission);
  
  // Save to database
  let dbSubmission = null;
  if (dbInitialized) {
    try {
      dbSubmission = await db.saveSubmission({
        sessionId,
        investorData: submission.investorData,
        investmentAmount: submission.investmentAmount,
        pricePerToken: submission.pricePerToken,
        tokensAllocated: submission.tokensAllocated,
        currency: submission.currency,
        walletAddress: submission.walletAddress,
        status: 'pending_review',
        priceFrozen: true,
        freezeExpiresAt
      });
      
      // Save price freeze
      await db.savePriceFreeze(sessionId, priceInfo.price, freezeExpiresAt, dbSubmission.id);
      
      console.log(`💾 Submission saved to database: ${dbSubmission.id}`);
    } catch (err) {
      console.error('Failed to save to database:', err);
    }
  }
  
  // Generate SAFT HTML document
  const saftHTML = generateSAFTHTML(submission);
  
  // Save document to database
  if (dbInitialized && dbSubmission) {
    try {
      await db.saveDocument({
        submissionId: dbSubmission.id,
        type: 'saft_html',
        filename: `SAFT_${investorData.fullName.replace(/\s+/g, '_')}_${submissionId.slice(0, 8)}.html`,
        contentHtml: saftHTML,
        fileSize: Buffer.byteLength(saftHTML, 'utf8')
      });
    } catch (err) {
      console.error('Failed to save document:', err);
    }
  }
  
  // Send Telegram notifications
  let telegramMessageId = null;
  if (bot) {
    const chatIds = [CONFIG.FOUNDER_CHAT_ID, ...CONFIG.ADMIN_CHAT_IDS].filter(Boolean);
    
    if (chatIds.length === 0) {
      console.log('ℹ️ No Telegram chat IDs configured. Skipping notifications.');
    } else {
    
    for (const chatId of chatIds) {
      try {
        const message = 
          `📝 *NEW SAFT SUBMISSION*\n\n` +
          `*Investor:* ${investorData.fullName}\n` +
          `*Email:* ${investorData.email}\n` +
          `*Phone:* ${investorData.phone}\n` +
          `*Investment:* $${parseFloat(investmentAmount).toLocaleString()} ${currency || 'USDC'}\n` +
          `*Price:* $${priceInfo.price.toFixed(4)}/token\n` +
          `*Tokens:* ${tokens.toLocaleString()} UNITY\n` +
          `*Wallet:* \`${walletAddress}\`\n` +
          `*Status:* ${investorData.investorStatus || 'individual'}\n\n` +
          `⏱ *Price frozen until:* ${freezeExpiresAt.toUTCString()}\n` +
          `📅 *Submitted:* ${new Date().toUTCString()}\n` +
          `🆔 *ID:* \`${submissionId}\``;
        
        const sentMsg = await bot.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Approve', callback_data: `approve_${submissionId}` },
                { text: '❌ Reject', callback_data: `reject_${submissionId}` }
              ],
              [
                { text: '📄 Full Details', callback_data: `view_${submissionId}` },
                { text: '📧 Email Investor', url: `mailto:${investorData.email}` }
              ]
            ]
          }
        });
        
        telegramMessageId = sentMsg.message_id;
        
        // Send SAFT document as file
        const docBuffer = Buffer.from(saftHTML, 'utf-8');
        await bot.sendDocument(chatId, docBuffer, {
          filename: `SAFT_${investorData.fullName.replace(/\s+/g, '_')}_${submissionId.slice(0, 8)}.html`,
          caption: `📄 SAFT Agreement for ${investorData.fullName}`
        }, {
          contentType: 'text/html'
        });
        
        console.log(`📨 Telegram notification sent to ${chatId}`);
      } catch (err) {
        console.error(`Failed to send Telegram notification to ${chatId}:`, err.message);
      }
    } // end for...of
    } // end if (chatIds.length > 0)
  } // end if (bot)
  
  // Update with Telegram message ID
  if (dbInitialized && dbSubmission && telegramMessageId) {
    try {
      await db.updateSubmissionStatus(dbSubmission.id, 'pending_review', telegramMessageId);
    } catch (err) {
      console.error('Failed to update telegram message ID:', err);
    }
  }
  
  console.log(`✅ SAFT submitted: ${submissionId} by ${investorData.fullName}`);
  
  res.json({
    success: true,
    submissionId: submissionId,
    priceFrozen: true,
    freezeExpiresAt: freezeExpiresAt.toISOString(),
    tokensAllocated: tokens,
    pricePerToken: priceInfo.price
  });
});

// Get submission status
app.get('/api/submission/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const submission = submissions.get(sessionId);
  
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  
  res.json(submission);
});

// Admin: Get all submissions
app.get('/api/admin/submissions', (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const allSubmissions = Array.from(submissions.values());
  res.json(allSubmissions);
});

// ==================== TELEGRAM BOT HANDLERS ====================

if (bot) {
  // Handle callback queries (button clicks)
  bot.on('callback_query', async (query) => {
    const { data, message } = query;
    const [action, submissionId] = data.split('_');
    
    // Find submission
    let submission = null;
    for (const [sid, sub] of submissions) {
      if (sub.id === submissionId) {
        submission = sub;
        break;
      }
    }
    
    if (!submission) {
      await bot.answerCallbackQuery(query.id, { text: 'Submission not found' });
      return;
    }
    
    if (action === 'approve') {
      submission.status = 'approved';
      await bot.sendMessage(
        CONFIG.FOUNDER_CHAT_ID,
        `✅ Submission approved!\n\nInvestor: ${submission.investorData.fullName}\nAmount: $${submission.investmentAmount.toLocaleString()}`
      );
      await bot.answerCallbackQuery(query.id, { text: 'Approved!' });
    } else if (action === 'reject') {
      submission.status = 'rejected';
      await bot.sendMessage(
        CONFIG.FOUNDER_CHAT_ID,
        `❌ Submission rejected!\n\nInvestor: ${submission.investorData.fullName}`
      );
      await bot.answerCallbackQuery(query.id, { text: 'Rejected!' });
    } else if (action === 'view') {
      const details = 
        `📋 *Submission Details*\n\n` +
        `*ID:* ${submission.id}\n` +
        `*Status:* ${submission.status}\n` +
        `*Name:* ${submission.investorData.fullName}\n` +
        `*Email:* ${submission.investorData.email}\n` +
        `*Phone:* ${submission.investorData.phone || 'N/A'}\n` +
        `*Amount:* $${submission.investmentAmount.toLocaleString()}\n` +
        `*Price:* $${submission.pricePerToken.toFixed(4)}\n` +
        `*Tokens:* ${submission.tokensAllocated.toLocaleString()}\n` +
        `*Wallet:* ${submission.walletAddress || 'N/A'}\n` +
        `*Currency:* ${submission.currency}`;
      
      await bot.sendMessage(CONFIG.FOUNDER_CHAT_ID, details, { parse_mode: 'Markdown' });
      await bot.answerCallbackQuery(query.id, { text: 'Details sent!' });
    }
  });
}

// ==================== CLEANUP CRON ====================

// Clean up expired price freezes every 5 minutes
cron.schedule('*/5 * * * *', () => {
  const now = new Date();
  let cleaned = 0;
  
  for (const [sessionId, freeze] of priceFreezes) {
    if (now > new Date(freeze.expiresAt)) {
      priceFreezes.delete(sessionId);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired price freezes`);
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n🚀 EthosLife SAFT Platform running on port ${PORT}`);
  console.log(`📊 Current token price: $${getCurrentPrice().toFixed(4)}`);
  console.log(`⏰ Price increase ends: ${CONFIG.END_DATE.toUTCString()}`);
  console.log(`❄️  Price freeze duration: 1 hour after submission\n`);
});

module.exports = { app, getCurrentPrice, getSessionPrice };
