/**
 * Stripe Webhook Handler for EthosLife
 * Processes Stripe events for subscriptions and payments
 */

const stripeService = require('../services/stripe');
const referralService = require('../services/referrals');
const cashbackService = require('../services/cashback');
const { pool } = require('../database');

/**
 * Handle incoming Stripe webhook
 */
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripeService.constructWebhookEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Handle checkout.session.completed
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);

  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error('Missing userId or planId in session metadata');
    return;
  }

  // Update subscription record in database
  await pool.query(
    `UPDATE user_subscriptions
     SET stripe_customer_id = $1,
         status = 'active',
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2`,
    [session.customer, userId]
  );

  // Track conversion for analytics
  await pool.query(
    `INSERT INTO subscription_events
     (user_id, event_type, plan_id, stripe_session_id, metadata, created_at)
     VALUES ($1, 'checkout_completed', $2, $3, $4, CURRENT_TIMESTAMP)`,
    [userId, planId, session.id, JSON.stringify(session)]
  );
}

/**
 * Handle invoice.payment_succeeded
 */
async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Invoice payment succeeded:', invoice.id);

  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  const amountPaid = invoice.amount_paid / 100; // Convert from cents

  if (!subscriptionId) {
    // One-time payment
    console.log('One-time payment received:', amountPaid);
    return;
  }

  // Get subscription details
  const subscription = await stripeService.getSubscription(subscriptionId);
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  // Update subscription in database
  await pool.query(
    `UPDATE user_subscriptions
     SET status = 'active',
         current_period_start = $1,
         current_period_end = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_subscription_id = $3`,
    [
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      subscriptionId
    ]
  );

  // Record the payment
  await pool.query(
    `INSERT INTO subscription_payments
     (user_id, subscription_id, invoice_id, amount, currency, status, paid_at, created_at)
     VALUES ($1, $2, $3, $4, $5, 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [userId, subscriptionId, invoice.id, amountPaid, invoice.currency]
  );

  // Process referral commission for subscription payment
  try {
    await referralService.processReferralCommission(
      userId,
      amountPaid,
      'subscription_payment',
      invoice.id
    );
  } catch (err) {
    console.error('Error processing referral commission:', err);
  }

  // Give cashback to referrer if applicable
  try {
    const referralCheck = await pool.query(
      `SELECT referrer_id FROM referral_relationships 
       WHERE referred_id = $1 AND level = 1`,
      [userId]
    );

    if (referralCheck.rows.length > 0) {
      await cashbackService.giveReferralCashback(
        referralCheck.rows[0].referrer_id,
        userId,
        amountPaid,
        'subscription',
        invoice.id
      );
    }
  } catch (err) {
    console.error('Error giving referral cashback:', err);
  }

  // Record payment event
  await pool.query(
    `INSERT INTO subscription_events
     (user_id, event_type, plan_id, stripe_invoice_id, metadata, created_at)
     VALUES ($1, 'payment_succeeded', $2, $3, $4, CURRENT_TIMESTAMP)`,
    [userId, subscription.metadata?.planId || 'unknown', invoice.id, 
     JSON.stringify({ amount: amountPaid, currency: invoice.currency })]
  );
}

/**
 * Handle invoice.payment_failed
 */
async function handleInvoicePaymentFailed(invoice) {
  console.log('Invoice payment failed:', invoice.id);

  const subscriptionId = invoice.subscription;

  if (subscriptionId) {
    // Update subscription status
    await pool.query(
      `UPDATE user_subscriptions
       SET status = 'payment_failed',
           updated_at = CURRENT_TIMESTAMP
       WHERE stripe_subscription_id = $1`,
      [subscriptionId]
    );
  }

  // Record failed payment
  await pool.query(
    `INSERT INTO subscription_payments
     (user_id, subscription_id, invoice_id, amount, currency, status, created_at)
     VALUES ($1, $2, $3, $4, $5, 'failed', CURRENT_TIMESTAMP)`,
    [
      invoice.customer,
      subscriptionId,
      invoice.id,
      invoice.amount_due / 100,
      invoice.currency
    ]
  );

  // Could send notification to user here
}

/**
 * Handle customer.subscription.updated
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);

  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  // Determine new status
  let status = subscription.status;
  if (subscription.cancel_at_period_end) {
    status = 'canceling';
  }

  // Update subscription in database
  await pool.query(
    `UPDATE user_subscriptions
     SET status = $1,
         plan_id = $2,
         cancel_at_period_end = $3,
         current_period_start = $4,
         current_period_end = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_subscription_id = $6`,
    [
      status,
      subscription.metadata?.planId || 'unknown',
      subscription.cancel_at_period_end,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      subscription.id
    ]
  );

  // Record event
  await pool.query(
    `INSERT INTO subscription_events
     (user_id, event_type, plan_id, stripe_subscription_id, metadata, created_at)
     VALUES ($1, 'subscription_updated', $2, $3, $4, CURRENT_TIMESTAMP)`,
    [
      userId,
      subscription.metadata?.planId || 'unknown',
      subscription.id,
      JSON.stringify({
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      })
    ]
  );
}

/**
 * Handle customer.subscription.deleted
 */
async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);

  const userId = subscription.metadata?.userId;

  // Update subscription in database
  await pool.query(
    `UPDATE user_subscriptions
     SET status = 'canceled',
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_subscription_id = $1`,
    [subscription.id]
  );

  if (userId) {
    // Record event
    await pool.query(
      `INSERT INTO subscription_events
       (user_id, event_type, plan_id, stripe_subscription_id, created_at)
       VALUES ($1, 'subscription_canceled', $2, $3, CURRENT_TIMESTAMP)`,
      [
        userId,
        subscription.metadata?.planId || 'unknown',
        subscription.id
      ]
    );
  }
}

/**
 * Handle customer.subscription.created
 */
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);

  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;

  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  // Check if subscription already exists
  const existingResult = await pool.query(
    'SELECT id FROM user_subscriptions WHERE stripe_subscription_id = $1',
    [subscription.id]
  );

  if (existingResult.rows.length > 0) {
    console.log('Subscription already exists in database');
    return;
  }

  // Create subscription record
  await pool.query(
    `INSERT INTO user_subscriptions
     (user_id, plan_id, stripe_customer_id, stripe_subscription_id, status,
      current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      userId,
      planId || 'unknown',
      subscription.customer,
      subscription.id,
      subscription.status,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      subscription.cancel_at_period_end
    ]
  );

  // Record event
  await pool.query(
    `INSERT INTO subscription_events
     (user_id, event_type, plan_id, stripe_subscription_id, metadata, created_at)
     VALUES ($1, 'subscription_created', $2, $3, $4, CURRENT_TIMESTAMP)`,
    [
      userId,
      planId || 'unknown',
      subscription.id,
      JSON.stringify({ status: subscription.status })
    ]
  );
}

/**
 * Handle payment_intent.succeeded
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  const userId = paymentIntent.metadata?.userId;
  const amount = paymentIntent.amount / 100;

  if (!userId) {
    console.log('No userId in payment intent metadata');
    return;
  }

  // Record the payment
  await pool.query(
    `INSERT INTO one_time_payments
     (user_id, payment_intent_id, amount, currency, status, metadata, created_at)
     VALUES ($1, $2, $3, $4, 'succeeded', $5, CURRENT_TIMESTAMP)`,
    [
      userId,
      paymentIntent.id,
      amount,
      paymentIntent.currency,
      JSON.stringify(paymentIntent.metadata)
    ]
  );

  // Process referral commission
  try {
    await referralService.processReferralCommission(
      userId,
      amount,
      'one_time_payment',
      paymentIntent.id
    );
  } catch (err) {
    console.error('Error processing referral commission:', err);
  }

  // Give cashback for shop purchase if applicable
  const purchaseType = paymentIntent.metadata?.purchaseType;
  if (purchaseType === 'shop') {
    try {
      await cashbackService.earnCashback(
        userId,
        amount,
        'shop_purchase',
        paymentIntent.id,
        paymentIntent.metadata?.description || 'Shop purchase'
      );
    } catch (err) {
      console.error('Error earning shop cashback:', err);
    }
  }
}

/**
 * Handle payment_intent.payment_failed
 */
async function handlePaymentIntentFailed(paymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);

  const userId = paymentIntent.metadata?.userId;

  // Record failed payment
  await pool.query(
    `INSERT INTO one_time_payments
     (user_id, payment_intent_id, amount, currency, status, metadata, created_at)
     VALUES ($1, $2, $3, $4, 'failed', $5, CURRENT_TIMESTAMP)`,
    [
      userId || null,
      paymentIntent.id,
      paymentIntent.amount / 100,
      paymentIntent.currency,
      JSON.stringify({
        ...paymentIntent.metadata,
        error: paymentIntent.last_payment_error
      })
    ]
  );
}

module.exports = {
  handleWebhook
};
