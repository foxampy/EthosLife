/**
 * Cart Routes
 * Shopping cart management
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// ============================================================
// CART MANAGEMENT
// ============================================================

/**
 * GET /api/cart
 * Get current cart
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || uuidv4();
    const userId = req.user?.id;

    let cartItems;
    
    if (userId) {
      // Get cart for logged in user
      const result = await db.pool.query(
        `SELECT ci.*, p.name, p.price, p.images, p.stock_quantity, p.sku
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = $1
         ORDER BY ci.created_at DESC`,
        [userId]
      );
      cartItems = result.rows;
    } else {
      // Get cart for guest session
      const result = await db.pool.query(
        `SELECT ci.*, p.name, p.price, p.images, p.stock_quantity, p.sku
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.session_id = $1
         ORDER BY ci.created_at DESC`,
        [sessionId]
      );
      cartItems = result.rows;
    }

    // Calculate totals
    let subtotal = 0;
    let itemCount = 0;
    
    for (const item of cartItems) {
      subtotal += parseFloat(item.price) * item.quantity;
      itemCount += item.quantity;
    }

    res.json({
      items: cartItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount,
      sessionId: userId ? undefined : sessionId
    });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

/**
 * POST /api/cart/add
 * Add item to cart
 */
router.post('/add', optionalAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const sessionId = req.headers['x-session-id'] || uuidv4();
    const userId = req.user?.id;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and has stock
    const productResult = await db.pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    if (product.stock_quantity !== null && product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    // Add or update cart item
    let cartItem;
    
    if (userId) {
      // Check if item already in cart
      const existingResult = await db.pool.query(
        'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      );

      if (existingResult.rows.length > 0) {
        // Update quantity
        const newQuantity = existingResult.rows[0].quantity + quantity;
        
        if (product.stock_quantity !== null && product.stock_quantity < newQuantity) {
          return res.status(400).json({ error: 'Not enough stock available' });
        }

        const updateResult = await db.pool.query(
          `UPDATE cart_items SET quantity = $1, updated_at = NOW()
           WHERE user_id = $2 AND product_id = $3
           RETURNING *`,
          [newQuantity, userId, productId]
        );
        cartItem = updateResult.rows[0];
      } else {
        // Insert new item
        const insertResult = await db.pool.query(
          `INSERT INTO cart_items (user_id, product_id, quantity)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [userId, productId, quantity]
        );
        cartItem = insertResult.rows[0];
      }
    } else {
      // Guest cart
      const existingResult = await db.pool.query(
        'SELECT * FROM cart_items WHERE session_id = $1 AND product_id = $2',
        [sessionId, productId]
      );

      if (existingResult.rows.length > 0) {
        const newQuantity = existingResult.rows[0].quantity + quantity;
        
        if (product.stock_quantity !== null && product.stock_quantity < newQuantity) {
          return res.status(400).json({ error: 'Not enough stock available' });
        }

        const updateResult = await db.pool.query(
          `UPDATE cart_items SET quantity = $1, updated_at = NOW()
           WHERE session_id = $2 AND product_id = $3
           RETURNING *`,
          [newQuantity, sessionId, productId]
        );
        cartItem = updateResult.rows[0];
      } else {
        const insertResult = await db.pool.query(
          `INSERT INTO cart_items (session_id, product_id, quantity)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [sessionId, productId, quantity]
        );
        cartItem = insertResult.rows[0];
      }
    }

    res.json({
      success: true,
      cartItem,
      message: 'Item added to cart'
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

/**
 * PUT /api/cart/:itemId
 * Update cart item quantity
 */
router.put('/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Verify ownership and get product info
    let cartItemResult;
    
    if (userId) {
      cartItemResult = await db.pool.query(
        `SELECT ci.*, p.stock_quantity FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.id = $1 AND ci.user_id = $2`,
        [itemId, userId]
      );
    } else {
      const sessionId = req.headers['x-session-id'];
      cartItemResult = await db.pool.query(
        `SELECT ci.*, p.stock_quantity FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.id = $1 AND ci.session_id = $2`,
        [itemId, sessionId]
      );
    }

    if (cartItemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const item = cartItemResult.rows[0];

    // Check stock
    if (item.stock_quantity !== null && quantity > item.stock_quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    if (quantity === 0) {
      // Remove item
      await db.pool.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
      return res.json({ success: true, removed: true });
    }

    // Update quantity
    const updateResult = await db.pool.query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [quantity, itemId]
    );

    res.json({
      success: true,
      cartItem: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

/**
 * DELETE /api/cart/:itemId
 * Remove item from cart
 */
router.delete('/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;

    let deleteResult;
    
    if (userId) {
      deleteResult = await db.pool.query(
        'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
        [itemId, userId]
      );
    } else {
      const sessionId = req.headers['x-session-id'];
      deleteResult = await db.pool.query(
        'DELETE FROM cart_items WHERE id = $1 AND session_id = $2 RETURNING *',
        [itemId, sessionId]
      );
    }

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

/**
 * POST /api/cart/clear
 * Clear entire cart
 */
router.post('/clear', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      await db.pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    } else {
      const sessionId = req.headers['x-session-id'];
      await db.pool.query('DELETE FROM cart_items WHERE session_id = $1', [sessionId]);
    }

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

/**
 * POST /api/cart/merge
 * Merge guest cart into user cart (on login)
 */
router.post('/merge', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Get guest cart items
    const guestItems = await db.pool.query(
      'SELECT * FROM cart_items WHERE session_id = $1',
      [sessionId]
    );

    let mergedCount = 0;

    for (const item of guestItems.rows) {
      // Check if user already has this product
      const existingResult = await db.pool.query(
        'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [userId, item.product_id]
      );

      if (existingResult.rows.length > 0) {
        // Update quantity (take max)
        const newQuantity = Math.max(existingResult.rows[0].quantity, item.quantity);
        await db.pool.query(
          'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2',
          [newQuantity, existingResult.rows[0].id]
        );
      } else {
        // Move item to user cart
        await db.pool.query(
          `UPDATE cart_items SET user_id = $1, session_id = NULL, updated_at = NOW()
           WHERE id = $2`,
          [userId, item.id]
        );
        mergedCount++;
      }
    }

    // Delete any remaining guest items (duplicates)
    await db.pool.query('DELETE FROM cart_items WHERE session_id = $1', [sessionId]);

    res.json({
      success: true,
      mergedCount,
      message: 'Cart merged successfully'
    });
  } catch (err) {
    console.error('Merge cart error:', err);
    res.status(500).json({ error: 'Failed to merge cart' });
  }
});

// ============================================================
// PROMO CODES
// ============================================================

/**
 * POST /api/cart/promo/validate
 * Validate promo code
 */
router.post('/promo/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }

    const promoResult = await db.pool.query(
      `SELECT * FROM promo_codes 
       WHERE code = $1 
       AND is_active = true
       AND (starts_at IS NULL OR starts_at <= NOW())
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [code.toUpperCase()]
    );

    if (promoResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired promo code' });
    }

    const promo = promoResult.rows[0];

    // Check usage limit
    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
      return res.status(400).json({ error: 'Promo code usage limit reached' });
    }

    // Check minimum order
    if (promo.minimum_order_amount && subtotal < promo.minimum_order_amount) {
      return res.status(400).json({ 
        error: `Minimum order amount of $${promo.minimum_order_amount} required` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discount_type === 'percentage') {
      discountAmount = subtotal * (promo.discount_value / 100);
      if (promo.maximum_discount_amount) {
        discountAmount = Math.min(discountAmount, promo.maximum_discount_amount);
      }
    } else {
      discountAmount = promo.discount_value;
    }

    res.json({
      valid: true,
      promo: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discount_type,
        discountValue: promo.discount_value,
        discountAmount: parseFloat(discountAmount.toFixed(2))
      }
    });
  } catch (err) {
    console.error('Validate promo error:', err);
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

module.exports = router;
