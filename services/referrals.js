/**
 * Referral System Service for EthosLife
 * Multi-level referral program with automatic payouts
 */

const crypto = require('crypto');
const { pool } = require('../database');

// Commission structure: Level -> Percentage
const COMMISSION_STRUCTURE = {
  1: 0.10, // 10% - Direct referral
  2: 0.05, // 5% - Level 2
  3: 0.03, // 3% - Level 3
  4: 0.01, // 1% - Level 4
  5: 0.01  // 1% - Level 5
};

const MINIMUM_PAYOUT_AMOUNT = 25; // Minimum $25 to withdraw

/**
 * Generate a unique referral code (6 characters)
 */
function generateReferralCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

/**
 * Get or create referral code for user
 */
async function getOrCreateReferralCode(userId) {
  try {
    // Check if user already has a code
    const existingResult = await pool.query(
      'SELECT * FROM referral_codes WHERE user_id = $1',
      [userId]
    );

    if (existingResult.rows.length > 0) {
      return existingResult.rows[0];
    }

    // Generate new unique code
    let code;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = generateReferralCode();
      const checkResult = await pool.query(
        'SELECT id FROM referral_codes WHERE code = $1',
        [code]
      );
      if (checkResult.rows.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique referral code');
    }

    // Create referral code record
    const result = await pool.query(
      `INSERT INTO referral_codes (user_id, code, created_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, code]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating referral code:', error);
    throw error;
  }
}

/**
 * Apply referral code during registration
 */
async function applyReferralCode(newUserId, referralCode) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Get referrer info
    const referrerResult = await client.query(
      'SELECT * FROM referral_codes WHERE code = $1',
      [referralCode.toUpperCase()]
    );

    if (referrerResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, error: 'Invalid referral code' };
    }

    const referrerId = referrerResult.rows[0].user_id;

    // Prevent self-referral
    if (referrerId === newUserId) {
      await client.query('ROLLBACK');
      return { success: false, error: 'Cannot use your own referral code' };
    }

    // Check if user already has a referrer
    const existingRefResult = await client.query(
      'SELECT * FROM referral_relationships WHERE referred_id = $1',
      [newUserId]
    );

    if (existingRefResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return { success: false, error: 'User already has a referrer' };
    }

    // Build referral chain
    const referralChain = await buildReferralChain(client, referrerId);

    // Create referral relationships for each level
    for (let level = 1; level <= Math.min(referralChain.length + 1, 5); level++) {
      let ancestorId;
      if (level === 1) {
        ancestorId = referrerId;
      } else {
        ancestorId = referralChain[level - 2]; // -2 because chain is 0-indexed
      }

      await client.query(
        `INSERT INTO referral_relationships 
         (referrer_id, referred_id, level, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [ancestorId, newUserId, level]
      );
    }

    // Update referrer's direct referral count
    await client.query(
      `UPDATE referral_codes 
       SET total_referrals = total_referrals + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [referrerId]
    );

    await client.query('COMMIT');

    return {
      success: true,
      referrerId,
      message: 'Referral code applied successfully'
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error applying referral code:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Build referral chain (get ancestors)
 */
async function buildReferralChain(client, userId) {
  const chain = [];
  let currentId = userId;
  let depth = 0;
  const maxDepth = 4; // Max 4 ancestors (for 5 levels total)

  while (depth < maxDepth) {
    const result = await client.query(
      `SELECT referrer_id FROM referral_relationships 
       WHERE referred_id = $1 AND level = 1`,
      [currentId]
    );

    if (result.rows.length === 0) break;

    const ancestorId = result.rows[0].referrer_id;
    chain.push(ancestorId);
    currentId = ancestorId;
    depth++;
  }

  return chain;
}

/**
 * Process referral commission for a purchase
 */
async function processReferralCommission(userId, amount, transactionType, transactionId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get all referral relationships where user is the referred
    const relationships = await client.query(
      `SELECT * FROM referral_relationships 
       WHERE referred_id = $1 AND level <= 5`,
      [userId]
    );

    const commissions = [];

    for (const rel of relationships.rows) {
      const commissionRate = COMMISSION_STRUCTURE[rel.level];
      const commissionAmount = parseFloat((amount * commissionRate).toFixed(2));

      // Record commission
      const commissionResult = await client.query(
        `INSERT INTO referral_commissions
         (referrer_id, referred_id, level, commission_rate, commission_amount,
          source_amount, transaction_type, transaction_id, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', CURRENT_TIMESTAMP)
         RETURNING *`,
        [rel.referrer_id, userId, rel.level, commissionRate, commissionAmount,
         amount, transactionType, transactionId]
      );

      commissions.push(commissionResult.rows[0]);

      // Update pending balance
      await client.query(
        `UPDATE referral_codes
         SET pending_earnings = pending_earnings + $1,
             total_earnings = total_earnings + $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [commissionAmount, rel.referrer_id]
      );
    }

    await client.query('COMMIT');

    return {
      success: true,
      commissionsCount: commissions.length,
      totalCommission: commissions.reduce((sum, c) => sum + parseFloat(c.commission_amount), 0)
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing referral commission:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get referral statistics for user
 */
async function getReferralStats(userId) {
  try {
    // Get user's referral code info
    const codeResult = await pool.query(
      'SELECT * FROM referral_codes WHERE user_id = $1',
      [userId]
    );

    if (codeResult.rows.length === 0) {
      return null;
    }

    const codeInfo = codeResult.rows[0];

    // Get breakdown by level
    const levelStats = await pool.query(
      `SELECT level, COUNT(*) as count
       FROM referral_relationships
       WHERE referrer_id = $1
       GROUP BY level
       ORDER BY level`,
      [userId]
    );

    // Get recent referrals
    const recentReferrals = await pool.query(
      `SELECT r.referred_id, r.level, r.created_at,
              u.email, u.full_name
       FROM referral_relationships r
       JOIN users u ON r.referred_id = u.id
       WHERE r.referrer_id = $1 AND r.level = 1
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [userId]
    );

    // Get monthly earnings
    const monthlyEarnings = await pool.query(
      `SELECT DATE_TRUNC('month', created_at) as month,
              SUM(commission_amount) as total
       FROM referral_commissions
       WHERE referrer_id = $1 AND status = 'paid'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC
       LIMIT 12`,
      [userId]
    );

    return {
      code: codeInfo.code,
      totalReferrals: parseInt(codeInfo.total_referrals) || 0,
      totalEarnings: parseFloat(codeInfo.total_earnings) || 0,
      pendingEarnings: parseFloat(codeInfo.pending_earnings) || 0,
      paidEarnings: parseFloat(codeInfo.paid_earnings) || 0,
      levelBreakdown: levelStats.rows,
      recentReferrals: recentReferrals.rows,
      monthlyEarnings: monthlyEarnings.rows
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    throw error;
  }
}

/**
 * Request payout
 */
async function requestPayout(userId, paymentMethod, paymentDetails) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get pending earnings
    const codeResult = await client.query(
      'SELECT * FROM referral_codes WHERE user_id = $1',
      [userId]
    );

    if (codeResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, error: 'No referral account found' };
    }

    const pendingEarnings = parseFloat(codeResult.rows[0].pending_earnings);

    if (pendingEarnings < MINIMUM_PAYOUT_AMOUNT) {
      await client.query('ROLLBACK');
      return {
        success: false,
        error: `Minimum payout amount is $${MINIMUM_PAYOUT_AMOUNT}. You have $${pendingEarnings.toFixed(2)}.`
      };
    }

    // Create payout request
    const payoutResult = await client.query(
      `INSERT INTO referral_payouts
       (user_id, amount, payment_method, payment_details, status, requested_at)
       VALUES ($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, pendingEarnings, paymentMethod, JSON.stringify(paymentDetails)]
    );

    // Mark commissions as processing
    await client.query(
      `UPDATE referral_commissions
       SET status = 'processing', payout_id = $1
       WHERE referrer_id = $2 AND status = 'pending'`,
      [payoutResult.rows[0].id, userId]
    );

    // Update user's pending earnings to 0
    await client.query(
      `UPDATE referral_codes
       SET pending_earnings = 0,
           paid_earnings = paid_earnings + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [pendingEarnings, userId]
    );

    await client.query('COMMIT');

    return {
      success: true,
      payout: payoutResult.rows[0],
      amount: pendingEarnings
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error requesting payout:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get payout history
 */
async function getPayoutHistory(userId, limit = 20) {
  try {
    const result = await pool.query(
      `SELECT * FROM referral_payouts
       WHERE user_id = $1
       ORDER BY requested_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting payout history:', error);
    throw error;
  }
}

/**
 * Get commission details
 */
async function getCommissionDetails(userId, limit = 50) {
  try {
    const result = await pool.query(
      `SELECT c.*, u.full_name as referred_name
       FROM referral_commissions c
       LEFT JOIN users u ON c.referred_id = u.id
       WHERE c.referrer_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting commission details:', error);
    throw error;
  }
}

/**
 * Process monthly auto-payout
 * This should be called by a cron job
 */
async function processMonthlyPayouts() {
  try {
    // Get all users with pending earnings above minimum
    const result = await pool.query(
      `SELECT user_id, pending_earnings
       FROM referral_codes
       WHERE pending_earnings >= $1`,
      [MINIMUM_PAYOUT_AMOUNT]
    );

    const processed = [];
    for (const row of result.rows) {
      try {
        // Process automatic payout (e.g., to Stripe Connect or crypto wallet)
        // This is a placeholder - implement actual payout logic
        processed.push({
          userId: row.user_id,
          amount: parseFloat(row.pending_earnings)
        });
      } catch (err) {
        console.error(`Failed to process payout for user ${row.user_id}:`, err);
      }
    }

    return { processed: processed.length, details: processed };
  } catch (error) {
    console.error('Error processing monthly payouts:', error);
    throw error;
  }
}

module.exports = {
  COMMISSION_STRUCTURE,
  MINIMUM_PAYOUT_AMOUNT,
  generateReferralCode,
  getOrCreateReferralCode,
  applyReferralCode,
  processReferralCommission,
  getReferralStats,
  requestPayout,
  getPayoutHistory,
  getCommissionDetails,
  processMonthlyPayouts
};
