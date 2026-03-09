/**
 * Stripe Integration Service for EthosLife
 * Handles subscriptions, payments, and customer management
 */

const Stripe = require('stripe');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Subscription Plans Configuration
const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'basic_trackers',
      '3_ai_daily',
      'community_access',
      'basic_analytics',
      '7_day_data_history'
    ],
    limits: {
      aiRequestsPerDay: 3,
      dataRetentionDays: 7,
      familyMembers: 0,
      coachingSessions: 0
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_xxx',
    price: 9.99,
    yearlyPrice: 99.99,
    yearlyDiscount: 17,
    features: [
      'unlimited_ai',
      'all_modules',
      'advanced_analytics',
      'priority_support',
      '30_day_data_history',
      'export_data',
      'custom_reminders',
      'health_insights'
    ],
    limits: {
      aiRequestsPerDay: -1, // unlimited
      dataRetentionDays: 30,
      familyMembers: 2,
      coachingSessions: 0
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_yyy',
    yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly_zzz',
    price: 19.99,
    yearlyPrice: 199.99,
    yearlyDiscount: 17,
    features: [
      'everything_in_premium',
      '1on1_coaching_monthly',
      'genetic_reports',
      'family_accounts_5',
      'unlimited_data_history',
      'api_access',
      'white_label_reports',
      'dedicated_manager',
      'early_access_features'
    ],
    limits: {
      aiRequestsPerDay: -1,
      dataRetentionDays: -1,
      familyMembers: 5,
      coachingSessions: 1 // per month
    }
  }
};

/**
 * Create a Stripe customer for a user
 */
async function createCustomer(userId, email, name, metadata = {}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
        ...metadata
      }
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Get or create customer
 */
async function getOrCreateCustomer(userId, email, name) {
  try {
    // Search for existing customer
    const customers = await stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
      limit: 1
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    // Create new customer
    return await createCustomer(userId, email, name);
  } catch (error) {
    console.error('Error getting/creating customer:', error);
    throw error;
  }
}

/**
 * Create a checkout session for subscription
 */
async function createCheckoutSession(customerId, priceId, userId, successUrl, cancelUrl, metadata = {}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          userId,
          ...metadata
        }
      },
      metadata: {
        userId,
        ...metadata
      }
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a billing portal session
 */
async function createBillingPortalSession(customerId, returnUrl) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
    return session;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw error;
  }
}

/**
 * Cancel subscription at period end
 */
async function cancelSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Reactivate subscription (remove cancel_at_period_end)
 */
async function reactivateSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });
    return subscription;
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
}

/**
 * Update subscription to new price
 */
async function updateSubscription(subscriptionId, newPriceId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId
        }
      ],
      proration_behavior: 'create_prorations'
    });

    return updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
async function getSubscription(subscriptionId) {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

/**
 * Get customer subscriptions
 */
async function getCustomerSubscriptions(customerId, status = 'all') {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status,
      limit: 10,
      expand: ['data.default_payment_method']
    });
    return subscriptions.data;
  } catch (error) {
    console.error('Error listing subscriptions:', error);
    throw error;
  }
}

/**
 * Get customer invoices
 */
async function getCustomerInvoices(customerId, limit = 10) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
      expand: ['data.charge']
    });
    return invoices.data;
  } catch (error) {
    console.error('Error listing invoices:', error);
    throw error;
  }
}

/**
 * Create a payment intent for one-time purchase
 */
async function createPaymentIntent(amount, currency, customerId, metadata = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: {
        enabled: true
      },
      metadata
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Get payment method details
 */
async function getPaymentMethod(paymentMethodId) {
  try {
    return await stripe.paymentMethods.retrieve(paymentMethodId);
  } catch (error) {
    console.error('Error retrieving payment method:', error);
    throw error;
  }
}

/**
 * Attach payment method to customer
 */
async function attachPaymentMethod(customerId, paymentMethodId) {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });
    return paymentMethod;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw error;
  }
}

/**
 * Set default payment method
 */
async function setDefaultPaymentMethod(customerId, paymentMethodId) {
  try {
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    return customer;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
}

/**
 * Construct webhook event
 */
function constructWebhookEvent(payload, signature, secret) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    throw error;
  }
}

/**
 * Get plan details by ID
 */
function getPlan(planId) {
  return PLANS[planId] || PLANS.free;
}

/**
 * Get all available plans
 */
function getAllPlans() {
  return Object.values(PLANS).map(plan => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    yearlyPrice: plan.yearlyPrice,
    yearlyDiscount: plan.yearlyDiscount,
    features: plan.features,
    limits: plan.limits,
    priceId: plan.priceId,
    yearlyPriceId: plan.yearlyPriceId
  }));
}

/**
 * Check if user has access to feature
 */
function hasFeatureAccess(userPlan, feature) {
  const plan = PLANS[userPlan] || PLANS.free;
  return plan.features.includes(feature);
}

/**
 * Check if user is within plan limits
 */
function checkPlanLimits(userPlan, limitType, currentValue) {
  const plan = PLANS[userPlan] || PLANS.free;
  const limit = plan.limits[limitType];
  
  if (limit === -1) return { allowed: true }; // Unlimited
  if (limit === 0) return { allowed: false, reason: 'Not available on this plan' };
  
  const remaining = limit - currentValue;
  return {
    allowed: remaining > 0,
    remaining,
    total: limit,
    reason: remaining <= 0 ? 'Limit reached' : null
  };
}

module.exports = {
  stripe,
  PLANS,
  createCustomer,
  getOrCreateCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscription,
  reactivateSubscription,
  updateSubscription,
  getSubscription,
  getCustomerSubscriptions,
  getCustomerInvoices,
  createPaymentIntent,
  getPaymentMethod,
  attachPaymentMethod,
  setDefaultPaymentMethod,
  constructWebhookEvent,
  getPlan,
  getAllPlans,
  hasFeatureAccess,
  checkPlanLimits
};
