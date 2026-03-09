/**
 * Orders Routes
 * Order management and checkout
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// ============================================================
// CHECKOUT
// ============================================================

/**
 * POST /api/orders/checkout
 * Create order from cart
 */
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shippingAddress,
      shippingMethod,
      promoCode,
      cashbackToUse,
      paymentMethod,
      notes
    } = req.body;

    // Get cart items
    const cartResult = await db.pool.query(
      `SELECT ci.*, p.name, p.price, p.stock_quantity, p.sku, p.images
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartItems = cartResult.rows;

    // Validate stock
    for (const item of cartItems) {
      if (item.stock_quantity !== null && item.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Not enough stock for ${item.name}. Available: ${item.stock_quantity}` 
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += parseFloat(item.price) * item.quantity;
    }

    // Apply promo code
    let discountAmount = 0;
    let appliedPromoCode = null;
    
    if (promoCode) {
      const promoResult = await db.pool.query(
        `SELECT * FROM promo_codes 
         WHERE code = $1 AND is_active = true
         AND (starts_at IS NULL OR starts_at <= NOW())
         AND (expires_at IS NULL OR expires_at > NOW())`,
        [promoCode.toUpperCase()]
      );

      if (promoResult.rows.length > 0) {
        const promo = promoResult.rows[0];
        
        // Check if user already used this code
        const usageResult = await db.pool.query(
          `SELECT COUNT(*) FROM promo_code_usage 
           WHERE user_id = $1 AND promo_code_id = $2`,
          [userId, promo.id]
        );

        if (parseInt(usageResult.rows[0].count) < (promo.per_user_limit || 1)) {
          if (promo.discount_type === 'percentage') {
            discountAmount = subtotal * (promo.discount_value / 100);
            if (promo.maximum_discount_amount) {
              discountAmount = Math.min(discountAmount, promo.maximum_discount_amount);
            }
          } else {
            discountAmount = Math.min(promo.discount_value, subtotal);
          }
          appliedPromoCode = promo.code;
        }
      }
    }

    // Calculate shipping
    const shippingRates = {
      'standard': 5.99,
      'express': 14.99,
      'free': 0
    };
    const shippingAmount = shippingRates[shippingMethod] || 5.99;

    // Calculate tax (simplified - would integrate with tax service)
    const taxRate = 0.08; // 8%
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * taxRate;

    // Apply cashback
    let cashbackApplied = 0;
    if (cashbackToUse > 0) {
      const userResult = await db.pool.query(
        'SELECT cashback_balance FROM users WHERE id = $1',
        [userId]
      );
      const availableCashback = parseFloat(userResult.rows[0]?.cashback_balance || 0);
      cashbackApplied = Math.min(cashbackToUse, availableCashback, taxableAmount + shippingAmount + taxAmount);
    }

    // Calculate final total
    const totalAmount = taxableAmount + shippingAmount + taxAmount - cashbackApplied;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const orderResult = await db.pool.query(
      `INSERT INTO orders (
        user_id, order_number, status, payment_status, fulfillment_status,
        subtotal, discount_amount, shipping_amount, tax_amount, total_amount,
        cashback_used, promo_code, promo_code_discount,
        shipping_address, shipping_method, payment_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        userId, orderNumber, 'pending', 'pending', 'unfulfilled',
        subtotal, discountAmount, shippingAmount, taxAmount, totalAmount,
        cashbackApplied, appliedPromoCode, discountAmount,
        JSON.stringify(shippingAddress), shippingMethod, paymentMethod, notes
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of cartItems) {
      await db.pool.query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, product_sku, product_image,
          quantity, unit_price, total_price
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          order.id, item.product_id, item.name, item.sku,
          item.images?.[0] || null, item.quantity, item.price,
          parseFloat(item.price) * item.quantity
        ]
      );

      // Update stock
      if (item.stock_quantity !== null) {
        await db.pool.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      // Increment sold count
      await db.pool.query(
        'UPDATE products SET sold_count = COALESCE(sold_count, 0) + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Record promo code usage
    if (appliedPromoCode) {
      const promoResult = await db.pool.query(
        'SELECT id FROM promo_codes WHERE code = $1',
        [appliedPromoCode]
      );
      if (promoResult.rows.length > 0) {
        await db.pool.query(
          `INSERT INTO promo_code_usage (user_id, promo_code_id, order_id)
           VALUES ($1, $2, $3)`,
          [userId, promoResult.rows[0].id, order.id]
        );
        await db.pool.query(
          'UPDATE promo_codes SET usage_count = usage_count + 1 WHERE id = $1',
          [promoResult.rows[0].id]
        );
      }
    }

    // Deduct cashback
    if (cashbackApplied > 0) {
      await db.pool.query(
        'UPDATE users SET cashback_balance = cashback_balance - $1 WHERE id = $2',
        [cashbackApplied, userId]
      );
    }

    // Clear cart
    await db.pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    // Calculate cashback to earn (e.g., 2% of order)
    const cashbackRate = 0.02;
    const cashbackEarned = Math.floor(totalAmount * cashbackRate * 100) / 100;

    await db.pool.query(
      `UPDATE orders SET cashback_earned = $1 WHERE id = $2`,
      [cashbackEarned, order.id]
    );

    res.status(201).json({
      success: true,
      order: {
        ...order,
        cashback_earned: cashbackEarned
      },
      message: 'Order created successfully'
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

function generateOrderNumber() {
  const prefix = 'ETH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ============================================================
// ORDER MANAGEMENT
// ============================================================

/**
 * GET /api/orders
 * Get user orders
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 10, offset = 0 } = req.query;

    let whereClause = 'user_id = $1';
    const values = [userId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    values.push(parseInt(limit), parseInt(offset));

    const ordersResult = await db.pool.query(
      `SELECT o.*, 
        (SELECT json_agg(oi.*) FROM order_items oi WHERE oi.order_id = o.id) as items
       FROM orders o
       WHERE ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    const countResult = await db.pool.query(
      `SELECT COUNT(*) FROM orders WHERE ${whereClause}`,
      values.slice(0, -2)
    );

    res.json({
      orders: ordersResult.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:id
 * Get order details
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderResult = await db.pool.query(
      `SELECT o.* FROM orders o
       WHERE o.id = $1 AND o.user_id = $2`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.pool.query(
      `SELECT oi.*, p.images as product_images
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      order: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

/**
 * POST /api/orders/:id/cancel
 * Cancel order
 */
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    // Get order
    const orderResult = await db.pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Can only cancel pending or paid orders
    if (!['pending', 'paid'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    // Start transaction
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Update order status
      await client.query(
        `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
        [id]
      );

      // Restore stock
      const itemsResult = await client.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id]
      );

      for (const item of itemsResult.rows) {
        if (item.product_id) {
          await client.query(
            'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
            [item.quantity, item.product_id]
          );
        }
      }

      // Refund cashback
      if (order.cashback_used > 0) {
        await client.query(
          'UPDATE users SET cashback_balance = cashback_balance + $1 WHERE id = $2',
          [order.cashback_used, userId]
        );
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// ============================================================
// PAYMENT (Stripe Integration)
// ============================================================

/**
 * POST /api/orders/:id/payment-intent
 * Create Stripe payment intent
 */
router.post('/:id/payment-intent', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderResult = await db.pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.payment_status === 'paid') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    // Create Stripe payment intent
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convert to cents
      currency: order.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        user_id: userId
      }
    });

    // Save payment intent ID
    await db.pool.query(
      'UPDATE orders SET stripe_payment_intent_id = $1 WHERE id = $2',
      [paymentIntent.id, id]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

/**
 * POST /api/orders/payment-success
 * Handle successful payment (called by webhook or frontend)
 */
router.post('/payment-success', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Get order by payment intent
    const orderResult = await db.pool.query(
      'SELECT * FROM orders WHERE stripe_payment_intent_id = $1',
      [paymentIntentId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Update order status
    await db.pool.query(
      `UPDATE orders SET 
        payment_status = 'paid', 
        status = 'processing',
        paid_at = NOW(),
        updated_at = NOW()
       WHERE id = $1`,
      [order.id]
    );

    // Add cashback to user
    if (order.cashback_earned > 0) {
      await db.pool.query(
        'UPDATE users SET cashback_balance = COALESCE(cashback_balance, 0) + $1 WHERE id = $2',
        [order.cashback_earned, order.user_id]
      );
    }

    res.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number
    });
  } catch (err) {
    console.error('Payment success error:', err);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

module.exports = router;
