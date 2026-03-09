/**
 * Products Routes
 * E-commerce product catalog API
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const db = require('../database');

// Product categories
const CATEGORIES = [
  'Supplements',
  'Wearables', 
  'Fitness',
  'Meditation',
  'Sleep',
  'Books'
];

// ============================================================
// PUBLIC ROUTES
// ============================================================

/**
 * GET /api/products
 * List products with filters
 * Query params: category, minPrice, maxPrice, search, sort, limit, offset
 */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'newest',
      limit = 20,
      offset = 0
    } = req.query;

    // Build query
    let whereClause = ['p.is_active = true'];
    const values = [];
    let paramIndex = 1;

    if (category) {
      whereClause.push(`p.category = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }

    if (minPrice) {
      whereClause.push(`p.price >= $${paramIndex}`);
      values.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereClause.push(`p.price <= $${paramIndex}`);
      values.push(parseFloat(maxPrice));
      paramIndex++;
    }

    if (search) {
      whereClause.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.tags @> ARRAY[$${paramIndex}::text])`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Sort options
    const sortOptions = {
      newest: 'p.created_at DESC',
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      name_asc: 'p.name ASC',
      popular: 'p.sold_count DESC NULLS LAST'
    };
    const orderBy = sortOptions[sort] || sortOptions.newest;

    const whereStr = whereClause.join(' AND ');
    values.push(parseInt(limit), parseInt(offset));

    // Get products
    const productsResult = await db.pool.query(
      `SELECT p.*, 
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as reviews_count
       FROM products p
       LEFT JOIN product_reviews r ON r.product_id = p.id AND r.is_public = true
       WHERE ${whereStr}
       GROUP BY p.id
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    // Get total count
    const countResult = await db.pool.query(
      `SELECT COUNT(*) FROM products p WHERE ${whereStr}`,
      values.slice(0, -2)
    );

    // Get categories with counts
    const categoriesResult = await db.pool.query(
      `SELECT category, COUNT(*) as count 
       FROM products 
       WHERE is_active = true 
       GROUP BY category 
       ORDER BY category`
    );

    res.json({
      products: productsResult.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset),
      categories: categoriesResult.rows
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/categories
 * Get all product categories
 */
router.get('/categories', (req, res) => {
  res.json({
    categories: CATEGORIES.map(cat => ({
      id: cat.toLowerCase(),
      name: cat,
      icon: getCategoryIcon(cat)
    }))
  });
});

function getCategoryIcon(category) {
  const icons = {
    'Supplements': 'pill',
    'Wearables': 'watch',
    'Fitness': 'dumbbell',
    'Meditation': 'brain',
    'Sleep': 'moon',
    'Books': 'book-open'
  };
  return icons[category] || 'box';
}

/**
 * GET /api/products/:id
 * Get product details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get product
    const productResult = await db.pool.query(
      `SELECT p.*,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as reviews_count
       FROM products p
       LEFT JOIN product_reviews r ON r.product_id = p.id AND r.is_public = true
       WHERE p.id = $1 AND p.is_active = true
       GROUP BY p.id`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Get reviews
    const reviewsResult = await db.pool.query(
      `SELECT r.*, u.full_name, u.avatar_url
       FROM product_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 AND r.is_public = true
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [id]
    );

    // Get related products
    const relatedResult = await db.pool.query(
      `SELECT p.* FROM products p
       WHERE p.category = $1 AND p.id != $2 AND p.is_active = true
       ORDER BY p.created_at DESC
       LIMIT 4`,
      [product.category, id]
    );

    res.json({
      product,
      reviews: reviewsResult.rows,
      relatedProducts: relatedResult.rows
    });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * GET /api/products/:id/reviews
 * Get product reviews
 */
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviewsResult = await db.pool.query(
      `SELECT r.*, u.full_name, u.avatar_url
       FROM product_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 AND r.is_public = true
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, parseInt(limit), parseInt(offset)]
    );

    // Get rating distribution
    const distributionResult = await db.pool.query(
      `SELECT rating, COUNT(*) as count
       FROM product_reviews
       WHERE product_id = $1 AND is_public = true
       GROUP BY rating
       ORDER BY rating DESC`,
      [id]
    );

    res.json({
      reviews: reviewsResult.rows,
      distribution: distributionResult.rows
    });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// ============================================================
// PROTECTED ROUTES
// ============================================================

/**
 * POST /api/products/:id/reviews
 * Add product review (authenticated)
 */
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user purchased this product
    const purchaseCheck = await db.pool.query(
      `SELECT 1 FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'paid'
       LIMIT 1`,
      [userId, id]
    );

    // Check if user already reviewed
    const existingReview = await db.pool.query(
      `SELECT 1 FROM product_reviews WHERE product_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const result = await db.pool.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, review, is_verified_purchase)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, userId, rating, review || '', purchaseCheck.rows.length > 0]
    );

    res.status(201).json({
      review: result.rows[0],
      message: 'Review added successfully'
    });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// ============================================================
// ADMIN ROUTES (would add admin middleware in production)
// ============================================================

/**
 * POST /api/products
 * Create product (admin)
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      compare_at_price,
      stock_quantity,
      sku,
      images,
      tags,
      metadata
    } = req.body;

    const result = await db.pool.query(
      `INSERT INTO products (name, description, category, price, compare_at_price, 
       stock_quantity, sku, images, tags, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, description, category, price, compare_at_price, 
       stock_quantity, sku, images || [], tags || [], metadata || {}]
    );

    res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id
 * Update product (admin)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'name', 'description', 'category', 'price', 'compare_at_price',
      'stock_quantity', 'sku', 'images', 'tags', 'is_active', 'metadata'
    ];

    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClause.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);

    const result = await db.pool.query(
      `UPDATE products SET ${setClause.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

module.exports = router;
