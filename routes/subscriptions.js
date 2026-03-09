/**
 * Subscription Routes for EthosLife
 * Handles Stripe checkout, billing, and subscription management
 */

const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe');
const { pool } = require('../database');

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify JWT token (implement your JWT verification here)
    // For now, using a simple mock - replace with actual JWT verification
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * POST /create-checkout-session
 * Create a Stripe checkout session for subscription
 */
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    const { planId, billingPeriod = 'monthly' } = req.body;
    const userId = req.user.userId || req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name || req.user.fullName;

    // Get plan details
    const plan = stripeService.getPlan(planId);
    if (!plan || planId === 'free') {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Get or create Stripe customer
    const customer = await stripeService.getOrCreateCustomer(userId, userEmail, userName);

    // Determine price ID based on billing period
    const priceId = billingPeriod === 'yearly' 
      ? (plan.yearlyPriceId || plan.priceId)
      : plan.priceId;

    if (!priceId || priceId.includes('xxx') || priceId.includes('yyy')) {
      return res.status(400).json({ 
        error: 'Stripe price ID not configured for this plan',
        message: 'Please contact support to subscribe'
      });
    }

    // Build success and cancel URLs
    const baseUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    const successUrl = `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing?canceled=true`;

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      customer.id,
      priceId,
      userId,
      successUrl,
      cancelUrl,
      { planId, billingPeriod }
    );

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
});

/**
 * POST /billing-portal
 * Create Stripe billing portal session
 */
router.post('/billing-portal', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Get user's Stripe customer ID from database
    const result = await pool.query(
      'SELECT stripe_customer_id FROM user_subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].stripe_customer_id) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const customerId = result.rows[0].stripe_customer_id;
    const baseUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    const returnUrl = `${baseUrl}/settings/subscription`;

    const session = await stripeService.createBillingPortalSession(customerId, returnUrl);

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

/**
 * POST /cancel
 * Cancel subscription at period end
 */
router.post('/cancel', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Get active subscription
    const result = await pool.query(
      `SELECT * FROM user_subscriptions 
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = result.rows[0];

    // Cancel in Stripe
    await stripeService.cancelSubscription(subscription.stripe_subscription_id);

    // Update local database
    await pool.query(
      `UPDATE user_subscriptions 
       SET cancel_at_period_end = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [subscription.id]
    );

    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      currentPeriodEnd: subscription.current_period_end
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * POST /reactivate
 * Reactivate a subscription that was set to cancel
 */
router.post('/reactivate', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Get subscription
    const result = await pool.query(
      `SELECT * FROM user_subscriptions 
       WHERE user_id = $1 AND status = 'active' AND cancel_at_period_end = true`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No canceled subscription found' });
    }

    const subscription = result.rows[0];

    // Reactivate in Stripe
    await stripeService.reactivateSubscription(subscription.stripe_subscription_id);

    // Update local database
    await pool.query(
      `UPDATE user_subscriptions 
       SET cancel_at_period_end = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [subscription.id]
    );

    res.json({
      success: true,
      message: 'Subscription reactivated successfully'
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

/**
 * POST /upgrade
 * Upgrade to a higher tier plan
 */
router.post('/upgrade', authenticateUser, async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.userId || req.user.id;

    // Get new plan
    const newPlan = stripeService.getPlan(planId);
    if (!newPlan || planId === 'free') {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Get current subscription
    const result = await pool.query(
      `SELECT * FROM user_subscriptions 
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No active subscription found',
        message: 'Please subscribe first'
      });
    }

    const subscription = result.rows[0];

    // Update subscription in Stripe
    const updatedSubscription = await stripeService.updateSubscription(
      subscription.stripe_subscription_id,
      newPlan.priceId
    );

    // Update local database
    await pool.query(
      `UPDATE user_subscriptions 
       SET plan_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [planId, subscription.id]
    );

    res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      newPlan: planId,
      prorationDate: updatedSubscription.proration_date
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ error: 'Failed to upgrade subscription' });
  }
});

/**
 * POST /downgrade
 * Downgrade to a lower tier plan
 */
router.post('/downgrade', authenticateUser, async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.userId || req.user.id;

    // Get new plan
    const newPlan = stripeService.getPlan(planId);
    if (!newPlan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Get current subscription
    const result = await pool.query(
      `SELECT * FROM user_subscriptions 
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = result.rows[0];

    // Update subscription in Stripe
    const updatedSubscription = await stripeService.updateSubscription(
      subscription.stripe_subscription_id,
      newPlan.priceId
    );

    // Update local database
    await pool.query(
      `UPDATE user_subscriptions 
       SET plan_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [planId, subscription.id]
    );

    res.json({
      success: true,
      message: 'Subscription downgraded successfully',
      newPlan: planId,
      effectiveDate: updatedSubscription.current_period_end
    });
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    res.status(500).json({ error: 'Failed to downgrade subscription' });
  }
});

/**
 * GET /current
 * Get current subscription details
 */
router.get('/current', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Get subscription from database
    const result = await pool.query(
      `SELECT us.*, 
              u.email, u.full_name
       FROM user_subscriptions us
       JOIN users u ON us.user_id = u.id
       WHERE us.user_id = $1
       ORDER BY us.created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Return free plan details
      const freePlan = stripeService.getPlan('free');
      return res.json({
        plan: freePlan,
        status: 'free',
        isActive: true,
        features: freePlan.features,
        limits: freePlan.limits
      });
    }

    const subscription = result.rows[0];
    const plan = stripeService.getPlan(subscription.plan_id);

    res.json({
      plan: plan,
      status: subscription.status,
      isActive: subscription.status === 'active',
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId: subscription.stripe_customer_id,
      features: plan.features,
      limits: plan.limits
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ error: 'Failed to get subscription details' });
  }
});

/**
 * GET /invoices
 * Get invoice history
 */
router.get('/invoices', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get customer's Stripe ID
    const result = await pool.query(
      'SELECT stripe_customer_id FROM user_subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].stripe_customer_id) {
      return res.json({ invoices: [] });
    }

    const customerId = result.rows[0].stripe_customer_id;
    const invoices = await stripeService.getCustomerInvoices(customerId, limit);

    res.json({
      invoices: invoices.map(inv => ({
        id: inv.id,
        amount: inv.amount_paid / 100,
        currency: inv.currency,
        status: inv.status,
        created: new Date(inv.created * 1000),
        pdfUrl: inv.invoice_pdf,
        periodStart: new Date(inv.period_start * 1000),
        periodEnd: new Date(inv.period_end * 1000),
        description: inv.description
      }))
    });
  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(500).json({ error: 'Failed to get invoices' });
  }
});

/**
 * GET /plans
 * Get all available plans
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = stripeService.getAllPlans();
    res.json({ plans });
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

/**
 * POST /apply-cashback
 * Apply cashback to subscription payment
 */
router.post('/apply-cashback', authenticateUser, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId || req.user.id;

    const cashbackService = require('../services/cashback');
    
    // Use cashback (this will be applied as credit in Stripe or applied to next invoice)
    const result = await cashbackService.useCashback(
      userId,
      amount,
      'subscription_discount',
      null,
      'Applied to subscription'
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      amountApplied: result.amountUsed,
      message: `Cashback of $${result.amountUsed.toFixed(2)} applied successfully`
    });
  } catch (error) {
    console.error('Error applying cashback:', error);
    res.status(500).json({ error: 'Failed to apply cashback' });
  }
});

module.exports = router;
