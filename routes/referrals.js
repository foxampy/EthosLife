/**
 * Referral Routes for EthosLife
 * Handles referral codes, stats, earnings, and payouts
 */

const express = require('express');
const router = express.Router();
const referralService = require('../services/referrals');

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * GET /referral/code
 * Get user's referral code
 */
router.get('/referral/code', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const referralCode = await referralService.getOrCreateReferralCode(userId);
    
    res.json({
      success: true,
      code: referralCode.code,
      referralUrl: `${process.env.FRONTEND_URL}/signup?ref=${referralCode.code}`
    });
  } catch (error) {
    console.error('Error getting referral code:', error);
    res.status(500).json({ error: 'Failed to get referral code' });
  }
});

/**
 * GET /referral/stats
 * Get referral statistics
 */
router.get('/referral/stats', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const stats = await referralService.getReferralStats(userId);
    
    if (!stats) {
      return res.json({
        code: null,
        totalReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        levelBreakdown: [],
        recentReferrals: [],
        monthlyEarnings: []
      });
    }
    
    res.json({
      success: true,
      ...stats,
      referralUrl: `${process.env.FRONTEND_URL}/signup?ref=${stats.code}`,
      commissionStructure: referralService.COMMISSION_STRUCTURE
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({ error: 'Failed to get referral statistics' });
  }
});

/**
 * GET /referral/earnings
 * Get detailed earnings breakdown
 */
router.get('/referral/earnings', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    
    const [stats, commissions, payouts] = await Promise.all([
      referralService.getReferralStats(userId),
      referralService.getCommissionDetails(userId, limit),
      referralService.getPayoutHistory(userId, 10)
    ]);
    
    res.json({
      success: true,
      summary: stats ? {
        totalEarnings: stats.totalEarnings,
        pendingEarnings: stats.pendingEarnings,
        paidEarnings: stats.paidEarnings
      } : {
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0
      },
      commissions: commissions.map(c => ({
        id: c.id,
        amount: parseFloat(c.commission_amount),
        rate: parseFloat(c.commission_rate) * 100,
        level: c.level,
        sourceAmount: parseFloat(c.source_amount),
        transactionType: c.transaction_type,
        status: c.status,
        createdAt: c.created_at,
        referredName: c.referred_name
      })),
      payouts: payouts.map(p => ({
        id: p.id,
        amount: parseFloat(p.amount),
        status: p.status,
        paymentMethod: p.payment_method,
        requestedAt: p.requested_at,
        processedAt: p.processed_at
      }))
    });
  } catch (error) {
    console.error('Error getting earnings:', error);
    res.status(500).json({ error: 'Failed to get earnings details' });
  }
});

/**
 * POST /referral/claim
 * Request payout of referral earnings
 */
router.post('/referral/claim', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { paymentMethod, paymentDetails } = req.body;
    
    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }
    
    const result = await referralService.requestPayout(userId, paymentMethod, paymentDetails);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json({
      success: true,
      message: 'Payout request submitted successfully',
      payoutId: result.payout.id,
      amount: result.amount,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error claiming payout:', error);
    res.status(500).json({ error: 'Failed to process payout request' });
  }
});

/**
 * GET /referral/network
 * Get multi-level referral network
 */
router.get('/referral/network', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const depth = parseInt(req.query.depth) || 3;
    
    // Get all referrals with their levels
    const { pool } = require('../database');
    const result = await pool.query(
      `SELECT 
        r.referred_id,
        r.level,
        r.created_at,
        u.full_name,
        u.email,
        us.plan_id,
        (SELECT COUNT(*) FROM referral_relationships WHERE referrer_id = r.referred_id AND level = 1) as their_referrals
       FROM referral_relationships r
       JOIN users u ON r.referred_id = u.id
       LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
       WHERE r.referrer_id = $1 AND r.level <= $2
       ORDER BY r.level, r.created_at DESC`,
      [userId, depth]
    );
    
    // Group by level
    const network = {
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: []
    };
    
    result.rows.forEach(row => {
      const levelKey = `level${row.level}`;
      if (network[levelKey]) {
        network[levelKey].push({
          id: row.referred_id,
          name: row.full_name,
          email: row.email,
          joinedAt: row.created_at,
          plan: row.plan_id || 'free',
          theirReferrals: parseInt(row.their_referrals)
        });
      }
    });
    
    res.json({
      success: true,
      network,
      totals: {
        level1: network.level1.length,
        level2: network.level2.length,
        level3: network.level3.length,
        level4: network.level4.length,
        level5: network.level5.length,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error getting network:', error);
    res.status(500).json({ error: 'Failed to get referral network' });
  }
});

/**
 * POST /referral/apply
 * Apply referral code (typically called during registration)
 */
router.post('/referral/apply', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Referral code is required' });
    }
    
    const result = await referralService.applyReferralCode(userId, code);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json({
      success: true,
      message: result.message,
      referrerId: result.referrerId
    });
  } catch (error) {
    console.error('Error applying referral code:', error);
    res.status(500).json({ error: 'Failed to apply referral code' });
  }
});

/**
 * GET /referral/leaderboard
 * Get top referrers leaderboard
 */
router.get('/referral/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const { pool } = require('../database');
    const result = await pool.query(
      `SELECT 
        rc.code,
        rc.total_referrals,
        rc.total_earnings,
        u.full_name,
        u.avatar_url
       FROM referral_codes rc
       JOIN users u ON rc.user_id = u.id
       WHERE rc.total_referrals > 0
       ORDER BY rc.total_earnings DESC
       LIMIT $1`,
      [limit]
    );
    
    res.json({
      success: true,
      leaderboard: result.rows.map((row, index) => ({
        rank: index + 1,
        name: row.full_name.split(' ')[0] + ' ' + row.full_name.split(' ').pop()?.[0] + '.',
        referrals: parseInt(row.total_referrals),
        earnings: parseFloat(row.total_earnings),
        avatar: row.avatar_url
      }))
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

module.exports = router;
