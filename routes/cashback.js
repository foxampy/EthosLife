/**
 * Cashback Routes for EthosLife
 * Handles cashback balance, history, and redemption
 */

const express = require('express');
const router = express.Router();
const cashbackService = require('../services/cashback');

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
 * GET /cashback/balance
 * Get user's cashback balance
 */
router.get('/cashback/balance', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const balance = await cashbackService.getCashbackBalance(userId);
    
    res.json({
      success: true,
      balance: {
        total: balance.totalBalance,
        available: balance.availableBalance,
        lifetimeEarned: balance.lifetimeEarned,
        lifetimeUsed: balance.lifetimeUsed
      },
      expiringSoon: {
        count: balance.expiringSoonCount,
        amount: balance.expiringSoonAmount
      }
    });
  } catch (error) {
    console.error('Error getting cashback balance:', error);
    res.status(500).json({ error: 'Failed to get cashback balance' });
  }
});

/**
 * GET /cashback/history
 * Get cashback transaction history
 */
router.get('/cashback/history', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const history = await cashbackService.getCashbackHistory(userId, limit, offset);
    
    res.json({
      success: true,
      transactions: history.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        rate: tx.rate * 100,
        sourceType: tx.source_type,
        description: tx.description,
        status: tx.status,
        usedAmount: tx.used_amount,
        createdAt: tx.created_at,
        expiresAt: tx.expires_at
      })),
      pagination: {
        limit,
        offset,
        hasMore: history.length === limit
      }
    });
  } catch (error) {
    console.error('Error getting cashback history:', error);
    res.status(500).json({ error: 'Failed to get cashback history' });
  }
});

/**
 * GET /cashback/expiring
 * Get expiring cashback details
 */
router.get('/cashback/expiring', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const expiring = await cashbackService.getExpiringCashback(userId);
    
    res.json({
      success: true,
      expiringCashback: expiring,
      totalExpiring: expiring.reduce((sum, item) => sum + item.remaining, 0),
      soonestExpiry: expiring.length > 0 ? expiring[0].expiresAt : null
    });
  } catch (error) {
    console.error('Error getting expiring cashback:', error);
    res.status(500).json({ error: 'Failed to get expiring cashback' });
  }
});

/**
 * GET /cashback/stats
 * Get detailed cashback statistics
 */
router.get('/cashback/stats', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const stats = await cashbackService.getCashbackStats(userId);
    
    res.json({
      success: true,
      balance: stats.balance,
      earningsBySource: stats.earningsBySource.map(s => ({
        source: s.source_type,
        count: parseInt(s.count),
        total: parseFloat(s.total)
      })),
      monthlyEarnings: stats.monthlyEarnings,
      rates: cashbackService.CASHBACK_RATES
    });
  } catch (error) {
    console.error('Error getting cashback stats:', error);
    res.status(500).json({ error: 'Failed to get cashback statistics' });
  }
});

/**
 * POST /cashback/apply
 * Apply cashback to a purchase
 */
router.post('/cashback/apply', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { amount, targetType, targetId, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    
    if (!targetType) {
      return res.status(400).json({ error: 'Target type is required' });
    }
    
    const result = await cashbackService.useCashback(
      userId,
      amount,
      targetType,
      targetId || null,
      description || 'Applied to purchase'
    );
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json({
      success: true,
      message: `Cashback of $${result.amountUsed.toFixed(2)} applied successfully`,
      amountApplied: result.amountUsed,
      redemptionId: result.redemption.id,
      transactionsUsed: result.usedTransactions.length
    });
  } catch (error) {
    console.error('Error applying cashback:', error);
    res.status(500).json({ error: 'Failed to apply cashback' });
  }
});

/**
 * GET /cashback/available-for-purchase
 * Get available cashback for a specific purchase
 */
router.get('/cashback/available-for-purchase', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const purchaseAmount = parseFloat(req.query.amount) || 0;
    
    const balance = await cashbackService.getCashbackBalance(userId);
    
    // Calculate how much cashback can be applied
    // Typically you can apply up to the purchase amount or your balance, whichever is lower
    const maxApplicable = Math.min(balance.availableBalance, purchaseAmount);
    
    // Get expiring cashback to warn user
    const expiring = await cashbackService.getExpiringCashback(userId);
    const expiringWithin30Days = expiring.filter(e => e.daysUntilExpiry <= 30);
    
    res.json({
      success: true,
      purchaseAmount,
      availableBalance: balance.availableBalance,
      maxApplicable,
      savingsPercentage: purchaseAmount > 0 ? (maxApplicable / purchaseAmount * 100).toFixed(1) : 0,
      expiringWarning: expiringWithin30Days.length > 0 ? {
        count: expiringWithin30Days.length,
        amount: expiringWithin30Days.reduce((sum, e) => sum + e.remaining, 0),
        soonestExpiry: expiringWithin30Days[0]?.expiresAt
      } : null
    });
  } catch (error) {
    console.error('Error getting available cashback:', error);
    res.status(500).json({ error: 'Failed to get available cashback' });
  }
});

/**
 * POST /cashback/earn
 * Record cashback earnings (called internally after purchases)
 * Admin only endpoint
 */
router.post('/cashback/earn', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { userId, amount, sourceType, sourceId, description } = req.body;
    
    if (!userId || !amount || !sourceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await cashbackService.earnCashback(
      userId,
      amount,
      sourceType,
      sourceId,
      description || `Cashback from ${sourceType}`
    );
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json({
      success: true,
      message: 'Cashback earned successfully',
      transaction: result.transaction,
      amount: result.amount,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error('Error earning cashback:', error);
    res.status(500).json({ error: 'Failed to record cashback' });
  }
});

module.exports = router;
