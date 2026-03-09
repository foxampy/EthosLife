/**
 * Cashback System Service for EthosLife
 * Rewards users with cashback on purchases and referrals
 */

const { pool } = require('../database');

// Cashback rates
const CASHBACK_RATES = {
  shop_purchase: 0.05,      // 5% from shop purchases
  consultation: 0.10,       // 10% from consultations
  referral_subscription: 0.01, // 1% from referral subscriptions
  referral_purchase: 0.02   // 2% from referral shop purchases
};

const CASHBACK_EXPIRATION_MONTHS = 12;

/**
 * Earn cashback
 */
async function earnCashback(userId, amount, sourceType, sourceId, description) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const rate = CASHBACK_RATES[sourceType] || 0;
    const cashbackAmount = parseFloat((amount * rate).toFixed(2));

    if (cashbackAmount <= 0) {
      await client.query('ROLLBACK');
      return { success: false, error: 'Invalid cashback amount' };
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + CASHBACK_EXPIRATION_MONTHS);

    // Record cashback transaction
    const transactionResult = await client.query(
      `INSERT INTO cashback_transactions
       (user_id, amount, rate, source_type, source_id, description, 
        expires_at, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, cashbackAmount, rate, sourceType, sourceId, description, expiresAt]
    );

    // Update user's total balance
    await client.query(
      `UPDATE cashback_balances
       SET total_balance = total_balance + $1,
           available_balance = available_balance + $1,
           lifetime_earned = lifetime_earned + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [cashbackAmount, userId]
    );

    // If no row updated, create new balance record
    const updateResult = await client.query(
      'SELECT * FROM cashback_balances WHERE user_id = $1',
      [userId]
    );

    if (updateResult.rows.length === 0) {
      await client.query(
        `INSERT INTO cashback_balances
         (user_id, total_balance, available_balance, lifetime_earned, updated_at)
         VALUES ($1, $2, $2, $2, CURRENT_TIMESTAMP)`,
        [userId, cashbackAmount]
      );
    }

    await client.query('COMMIT');

    return {
      success: true,
      transaction: transactionResult.rows[0],
      amount: cashbackAmount,
      expiresAt
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error earning cashback:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Use cashback (apply to purchase)
 */
async function useCashback(userId, amount, targetType, targetId, description) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check available balance
    const balanceResult = await client.query(
      'SELECT available_balance FROM cashback_balances WHERE user_id = $1',
      [userId]
    );

    if (balanceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, error: 'No cashback balance found' };
    }

    const availableBalance = parseFloat(balanceResult.rows[0].available_balance);

    if (availableBalance < amount) {
      await client.query('ROLLBACK');
      return {
        success: false,
        error: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`
      };
    }

    // Mark cashback as used (FIFO - use oldest first)
    let remainingToUse = amount;
    const usedTransactions = [];

    while (remainingToUse > 0) {
      const transactionResult = await client.query(
        `SELECT * FROM cashback_transactions
         WHERE user_id = $1 AND status = 'active'
         ORDER BY created_at ASC
         LIMIT 1`,
        [userId]
      );

      if (transactionResult.rows.length === 0) break;

      const transaction = transactionResult.rows[0];
      const availableInTx = parseFloat(transaction.amount) - parseFloat(transaction.used_amount || 0);
      const useAmount = Math.min(availableInTx, remainingToUse);

      await client.query(
        `UPDATE cashback_transactions
         SET used_amount = used_amount + $1,
             status = CASE WHEN used_amount + $1 >= amount THEN 'used' ELSE 'partially_used' END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [useAmount, transaction.id]
      );

      usedTransactions.push({
        transactionId: transaction.id,
        amount: useAmount
      });

      remainingToUse -= useAmount;
    }

    // Update balance
    await client.query(
      `UPDATE cashback_balances
       SET total_balance = total_balance - $1,
           available_balance = available_balance - $1,
           lifetime_used = lifetime_used + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [amount, userId]
    );

    // Record redemption
    const redemptionResult = await client.query(
      `INSERT INTO cashback_redemptions
       (user_id, amount, target_type, target_id, description, 
        used_transactions, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, amount, targetType, targetId, description, JSON.stringify(usedTransactions)]
    );

    await client.query('COMMIT');

    return {
      success: true,
      redemption: redemptionResult.rows[0],
      usedTransactions,
      amountUsed: amount
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error using cashback:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get user's cashback balance
 */
async function getCashbackBalance(userId) {
  try {
    const result = await pool.query(
      `SELECT 
        total_balance,
        available_balance,
        lifetime_earned,
        lifetime_used,
        (SELECT COUNT(*) FROM cashback_transactions 
         WHERE user_id = $1 AND status = 'active' 
         AND expires_at < CURRENT_TIMESTAMP + INTERVAL '30 days') as expiring_soon_count,
        (SELECT COALESCE(SUM(amount - used_amount), 0) FROM cashback_transactions 
         WHERE user_id = $1 AND status IN ('active', 'partially_used') 
         AND expires_at < CURRENT_TIMESTAMP + INTERVAL '30 days') as expiring_soon_amount
       FROM cashback_balances
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return {
        totalBalance: 0,
        availableBalance: 0,
        lifetimeEarned: 0,
        lifetimeUsed: 0,
        expiringSoonCount: 0,
        expiringSoonAmount: 0
      };
    }

    const row = result.rows[0];
    return {
      totalBalance: parseFloat(row.total_balance) || 0,
      availableBalance: parseFloat(row.available_balance) || 0,
      lifetimeEarned: parseFloat(row.lifetime_earned) || 0,
      lifetimeUsed: parseFloat(row.lifetime_used) || 0,
      expiringSoonCount: parseInt(row.expiring_soon_count) || 0,
      expiringSoonAmount: parseFloat(row.expiring_soon_amount) || 0
    };
  } catch (error) {
    console.error('Error getting cashback balance:', error);
    throw error;
  }
}

/**
 * Get cashback transaction history
 */
async function getCashbackHistory(userId, limit = 50, offset = 0) {
  try {
    const result = await pool.query(
      `SELECT * FROM cashback_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows.map(row => ({
      ...row,
      amount: parseFloat(row.amount),
      used_amount: parseFloat(row.used_amount || 0),
      rate: parseFloat(row.rate)
    }));
  } catch (error) {
    console.error('Error getting cashback history:', error);
    throw error;
  }
}

/**
 * Get expiring cashback
 */
async function getExpiringCashback(userId) {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        amount,
        used_amount,
        (amount - used_amount) as remaining,
        expires_at,
        description,
        source_type
       FROM cashback_transactions
       WHERE user_id = $1 
       AND status IN ('active', 'partially_used')
       AND expires_at > CURRENT_TIMESTAMP
       ORDER BY expires_at ASC`,
      [userId]
    );

    return result.rows.map(row => ({
      id: row.id,
      amount: parseFloat(row.amount),
      usedAmount: parseFloat(row.used_amount || 0),
      remaining: parseFloat(row.remaining),
      expiresAt: row.expires_at,
      description: row.description,
      sourceType: row.source_type,
      daysUntilExpiry: Math.ceil((new Date(row.expires_at) - new Date()) / (1000 * 60 * 60 * 24))
    }));
  } catch (error) {
    console.error('Error getting expiring cashback:', error);
    throw error;
  }
}

/**
 * Get cashback stats
 */
async function getCashbackStats(userId) {
  try {
    const balance = await getCashbackBalance(userId);
    
    // Get earnings by source type
    const earningsBySource = await pool.query(
      `SELECT source_type, 
              COUNT(*) as count,
              SUM(amount) as total
       FROM cashback_transactions
       WHERE user_id = $1
       GROUP BY source_type`,
      [userId]
    );

    // Get monthly earnings
    const monthlyEarnings = await pool.query(
      `SELECT DATE_TRUNC('month', created_at) as month,
              SUM(amount) as earned,
              SUM(used_amount) as used
       FROM cashback_transactions
       WHERE user_id = $1
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC
       LIMIT 12`,
      [userId]
    );

    return {
      balance,
      earningsBySource: earningsBySource.rows,
      monthlyEarnings: monthlyEarnings.rows.map(row => ({
        month: row.month,
        earned: parseFloat(row.earned),
        used: parseFloat(row.used)
      }))
    };
  } catch (error) {
    console.error('Error getting cashback stats:', error);
    throw error;
  }
}

/**
 * Process expired cashback
 * Should be run by a cron job daily
 */
async function processExpiredCashback() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Find all expired transactions
    const expiredResult = await client.query(
      `SELECT user_id, SUM(amount - used_amount) as expired_amount
       FROM cashback_transactions
       WHERE status IN ('active', 'partially_used')
       AND expires_at < CURRENT_TIMESTAMP
       GROUP BY user_id`,
    );

    let totalExpired = 0;
    let usersAffected = 0;

    for (const row of expiredResult.rows) {
      const expiredAmount = parseFloat(row.expired_amount);
      
      // Update transaction status
      await client.query(
        `UPDATE cashback_transactions
         SET status = 'expired',
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 
         AND status IN ('active', 'partially_used')
         AND expires_at < CURRENT_TIMESTAMP`,
        [row.user_id]
      );

      // Update user balance
      await client.query(
        `UPDATE cashback_balances
         SET total_balance = total_balance - $1,
             available_balance = available_balance - $1,
             lifetime_expired = lifetime_expired + $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [expiredAmount, row.user_id]
      );

      totalExpired += expiredAmount;
      usersAffected++;
    }

    await client.query('COMMIT');

    return {
      usersAffected,
      totalExpired,
      processed: expiredResult.rows.length
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing expired cashback:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Give cashback from referral purchase
 */
async function giveReferralCashback(referrerId, referredId, amount, purchaseType, purchaseId) {
  const rate = purchaseType === 'subscription' 
    ? CASHBACK_RATES.referral_subscription 
    : CASHBACK_RATES.referral_purchase;

  const cashbackAmount = parseFloat((amount * rate).toFixed(2));

  if (cashbackAmount <= 0) return null;

  return await earnCashback(
    referrerId,
    cashbackAmount,
    purchaseType === 'subscription' ? 'referral_subscription' : 'referral_purchase',
    purchaseId,
    `Cashback from referral purchase (User: ${referredId})`
  );
}

module.exports = {
  CASHBACK_RATES,
  CASHBACK_EXPIRATION_MONTHS,
  earnCashback,
  useCashback,
  getCashbackBalance,
  getCashbackHistory,
  getExpiringCashback,
  getCashbackStats,
  processExpiredCashback,
  giveReferralCashback
};
