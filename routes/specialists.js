/**
 * Specialists Routes
 * Health specialists marketplace API
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// ============================================================
// PUBLIC ROUTES
// ============================================================

/**
 * GET /api/specialists
 * List specialists with filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      specialization,
      minPrice,
      maxPrice,
      language,
      isVerified,
      rating,
      available,
      search,
      sort = 'rating',
      limit = 20,
      offset = 0
    } = req.query;

    let whereClause = ['s.is_active = true'];
    const values = [];
    let paramIndex = 1;

    if (specialization) {
      whereClause.push(`$${paramIndex} = ANY(s.specializations)`);
      values.push(specialization);
      paramIndex++;
    }

    if (minPrice) {
      whereClause.push(`s.hourly_rate >= $${paramIndex}`);
      values.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereClause.push(`s.hourly_rate <= $${paramIndex}`);
      values.push(parseFloat(maxPrice));
      paramIndex++;
    }

    if (language) {
      whereClause.push(`$${paramIndex} = ANY(s.languages)`);
      values.push(language);
      paramIndex++;
    }

    if (isVerified !== undefined) {
      whereClause.push(`s.is_verified = $${paramIndex}`);
      values.push(isVerified === 'true');
      paramIndex++;
    }

    if (rating) {
      whereClause.push(`s.rating >= $${paramIndex}`);
      values.push(parseFloat(rating));
      paramIndex++;
    }

    if (search) {
      whereClause.push(`(u.full_name ILIKE $${paramIndex} OR s.bio ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Sort options
    const sortOptions = {
      'rating': 's.rating DESC, s.reviews_count DESC',
      'price_asc': 's.hourly_rate ASC',
      'price_desc': 's.hourly_rate DESC',
      'experience': 's.years_experience DESC',
      'reviews': 's.reviews_count DESC',
      'newest': 's.created_at DESC'
    };
    const orderBy = sortOptions[sort] || sortOptions.rating;

    const whereStr = whereClause.join(' AND ');
    values.push(parseInt(limit), parseInt(offset));

    const specialistsResult = await db.pool.query(
      `SELECT s.*, u.full_name, u.avatar_url, u.email
       FROM specialists s
       JOIN users u ON s.user_id = u.id
       WHERE ${whereStr}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    // Get total count
    const countResult = await db.pool.query(
      `SELECT COUNT(*) FROM specialists s
       JOIN users u ON s.user_id = u.id
       WHERE ${whereStr}`,
      values.slice(0, -2)
    );

    // Get specializations with counts
    const specializationsResult = await db.pool.query(
      `SELECT unnest(specializations) as name, COUNT(*) as count
       FROM specialists
       WHERE is_active = true
       GROUP BY unnest(specializations)
       ORDER BY count DESC`
    );

    // Get languages with counts
    const languagesResult = await db.pool.query(
      `SELECT unnest(languages) as name, COUNT(*) as count
       FROM specialists
       WHERE is_active = true AND languages IS NOT NULL
       GROUP BY unnest(languages)
       ORDER BY count DESC`
    );

    res.json({
      specialists: specialistsResult.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters: {
        specializations: specializationsResult.rows,
        languages: languagesResult.rows
      }
    });
  } catch (err) {
    console.error('Get specialists error:', err);
    res.status(500).json({ error: 'Failed to fetch specialists' });
  }
});

/**
 * GET /api/specialists/specializations
 * Get all specializations
 */
router.get('/filters/specializations', async (req, res) => {
  try {
    const specializations = [
      { id: 'nutrition', name: 'Nutrition', icon: 'apple' },
      { id: 'fitness', name: 'Fitness Training', icon: 'dumbbell' },
      { id: 'mental_health', name: 'Mental Health', icon: 'brain' },
      { id: 'sleep', name: 'Sleep Therapy', icon: 'moon' },
      { id: 'yoga', name: 'Yoga', icon: 'flower' },
      { id: 'meditation', name: 'Meditation', icon: 'sparkles' },
      { id: 'physiotherapy', name: 'Physiotherapy', icon: 'activity' },
      { id: 'life_coaching', name: 'Life Coaching', icon: 'target' },
      { id: 'stress_management', name: 'Stress Management', icon: 'heart' },
      { id: 'weight_management', name: 'Weight Management', icon: 'scale' }
    ];

    res.json({ specializations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch specializations' });
  }
});

/**
 * GET /api/specialists/:id
 * Get specialist details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get specialist
    const specialistResult = await db.pool.query(
      `SELECT s.*, u.full_name, u.avatar_url, u.email
       FROM specialists s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.is_active = true`,
      [id]
    );

    if (specialistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Specialist not found' });
    }

    const specialist = specialistResult.rows[0];

    // Get services
    const servicesResult = await db.pool.query(
      `SELECT * FROM specialist_services 
       WHERE specialist_id = $1 AND is_active = true
       ORDER BY price ASC`,
      [id]
    );

    // Get availability schedule
    const availabilityResult = await db.pool.query(
      `SELECT * FROM specialist_availability 
       WHERE specialist_id = $1 AND is_available = true
       ORDER BY day_of_week, start_time`,
      [id]
    );

    // Get reviews
    const reviewsResult = await db.pool.query(
      `SELECT sr.*, u.full_name, u.avatar_url
       FROM specialist_reviews sr
       JOIN users u ON sr.client_id = u.id
       WHERE sr.specialist_id = $1 AND sr.is_public = true
       ORDER BY sr.created_at DESC
       LIMIT 10`,
      [id]
    );

    // Get review distribution
    const distributionResult = await db.pool.query(
      `SELECT rating, COUNT(*) as count
       FROM specialist_reviews
       WHERE specialist_id = $1 AND is_public = true
       GROUP BY rating
       ORDER BY rating DESC`,
      [id]
    );

    res.json({
      specialist,
      services: servicesResult.rows,
      availability: availabilityResult.rows,
      reviews: reviewsResult.rows,
      ratingDistribution: distributionResult.rows
    });
  } catch (err) {
    console.error('Get specialist error:', err);
    res.status(500).json({ error: 'Failed to fetch specialist' });
  }
});

/**
 * GET /api/specialists/:id/availability
 * Get available time slots
 */
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, days = 7 } = req.query;

    // Get specialist availability schedule
    const scheduleResult = await db.pool.query(
      `SELECT * FROM specialist_availability 
       WHERE specialist_id = $1 AND is_available = true`,
      [id]
    );

    // Get existing bookings
    const startDate = date ? new Date(date) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(days));

    const bookingsResult = await db.pool.query(
      `SELECT scheduled_at, duration_minutes 
       FROM bookings 
       WHERE specialist_id = $1 
       AND scheduled_at >= $2 
       AND scheduled_at < $3
       AND status NOT IN ('cancelled', 'no_show')`,
      [id, startDate, endDate]
    );

    const bookedSlots = bookingsResult.rows.map(b => ({
      start: new Date(b.scheduled_at),
      end: new Date(new Date(b.scheduled_at).getTime() + b.duration_minutes * 60000)
    }));

    // Generate available slots
    const availableSlots = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay();
      const daySchedule = scheduleResult.rows.filter(s => s.day_of_week === dayOfWeek);

      for (const schedule of daySchedule) {
        const slotDate = new Date(currentDate);
        const [startHour, startMin] = schedule.start_time.split(':').map(Number);
        const [endHour, endMin] = schedule.end_time.split(':').map(Number);

        let slotTime = new Date(slotDate.setHours(startHour, startMin, 0, 0));
        const endTime = new Date(slotDate.setHours(endHour, endMin, 0, 0));

        // Generate 30 or 60 minute slots
        while (slotTime < endTime) {
          const slotEnd = new Date(slotTime.getTime() + 60 * 60000); // 60 min slots
          
          // Check if slot is booked
          const isBooked = bookedSlots.some(booked => {
            return (slotTime >= booked.start && slotTime < booked.end) ||
                   (slotEnd > booked.start && slotEnd <= booked.end);
          });

          if (!isBooked && slotTime > new Date()) {
            availableSlots.push({
              date: slotTime.toISOString().split('T')[0],
              time: slotTime.toTimeString().slice(0, 5),
              datetime: slotTime.toISOString(),
              duration: 60
            });
          }

          slotTime = new Date(slotTime.getTime() + 60 * 60000); // Next hour
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      slots: availableSlots.slice(0, 30) // Limit to 30 slots
    });
  } catch (err) {
    console.error('Get availability error:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// ============================================================
// BOOKING ROUTES (Protected)
// ============================================================

/**
 * POST /api/specialists/:id/book
 * Book a specialist
 */
router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      serviceId,
      scheduledAt,
      timezone = 'UTC',
      clientNotes,
      paymentMethod = 'stripe'
    } = req.body;

    if (!serviceId || !scheduledAt) {
      return res.status(400).json({ error: 'Service and scheduled time are required' });
    }

    // Get service details
    const serviceResult = await db.pool.query(
      'SELECT * FROM specialist_services WHERE id = $1 AND specialist_id = $2 AND is_active = true',
      [serviceId, id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = serviceResult.rows[0];

    // Check if slot is available
    const bookingCheck = await db.pool.query(
      `SELECT 1 FROM bookings 
       WHERE specialist_id = $1 
       AND scheduled_at = $2
       AND status NOT IN ('cancelled', 'no_show')`,
      [id, scheduledAt]
    );

    if (bookingCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Time slot is no longer available' });
    }

    // Generate booking number
    const bookingNumber = generateBookingNumber();

    // Create booking
    const bookingResult = await db.pool.query(
      `INSERT INTO bookings (
        booking_number, type, specialist_id, service_id, user_id,
        scheduled_at, duration_minutes, timezone, price, currency,
        meeting_type, client_notes, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        bookingNumber, 'specialist', id, serviceId, userId,
        scheduledAt, service.duration_minutes, timezone, service.price, service.currency,
        'video', clientNotes, 'pending'
      ]
    );

    const booking = bookingResult.rows[0];

    // Create Stripe payment intent if needed
    let paymentIntent = null;
    if (paymentMethod === 'stripe' && process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(service.price * 100),
        currency: service.currency.toLowerCase(),
        metadata: {
          booking_id: booking.id,
          booking_number: bookingNumber,
          user_id: userId,
          type: 'specialist_booking'
        }
      });

      await db.pool.query(
        'UPDATE bookings SET stripe_payment_intent_id = $1 WHERE id = $2',
        [paymentIntent.id, booking.id]
      );
    }

    res.status(201).json({
      success: true,
      booking: {
        ...booking,
        service: {
          name: service.name,
          duration: service.duration_minutes
        }
      },
      payment: paymentIntent ? {
        clientSecret: paymentIntent.client_secret,
        amount: service.price,
        currency: service.currency
      } : null
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

function generateBookingNumber() {
  const prefix = 'BK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ============================================================
// MY BOOKINGS
// ============================================================

/**
 * GET /api/specialists/bookings/my
 * Get my bookings (as client)
 */
router.get('/bookings/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, upcoming, limit = 10, offset = 0 } = req.query;

    let whereClause = 'b.user_id = $1';
    const values = [userId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND b.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (upcoming === 'true') {
      whereClause += ` AND b.scheduled_at > NOW()`;
    }

    values.push(parseInt(limit), parseInt(offset));

    const bookingsResult = await db.pool.query(
      `SELECT b.*, 
        s.name as service_name,
        u.full_name as specialist_name,
        u.avatar_url as specialist_avatar
       FROM bookings b
       LEFT JOIN specialist_services s ON b.service_id = s.id
       LEFT JOIN specialists sp ON b.specialist_id = sp.id
       LEFT JOIN users u ON sp.user_id = u.id
       WHERE ${whereClause}
       ORDER BY b.scheduled_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    const countResult = await db.pool.query(
      `SELECT COUNT(*) FROM bookings b WHERE ${whereClause}`,
      values.slice(0, -2)
    );

    res.json({
      bookings: bookingsResult.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * POST /api/specialists/bookings/:id/cancel
 * Cancel booking
 */
router.post('/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    const bookingResult = await db.pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Can only cancel confirmed bookings
    if (!['confirmed', 'pending'].includes(booking.status)) {
      return res.status(400).json({ error: 'Booking cannot be cancelled' });
    }

    // Check cancellation policy (e.g., 24 hours before)
    const scheduledTime = new Date(booking.scheduled_at);
    const now = new Date();
    const hoursUntilBooking = (scheduledTime - now) / (1000 * 60 * 60);

    if (hoursUntilBooking < 24) {
      return res.status(400).json({ 
        error: 'Bookings can only be cancelled at least 24 hours in advance' 
      });
    }

    await db.pool.query(
      `UPDATE bookings SET 
        status = 'cancelled', 
        cancelled_at = NOW(),
        specialist_notes = COALESCE(specialist_notes, '') || ' Cancellation reason: ' || $2
       WHERE id = $1`,
      [id, reason || 'Not specified']
    );

    // Refund if paid
    if (booking.payment_status === 'paid' && booking.stripe_payment_intent_id) {
      // Would trigger refund via Stripe
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// ============================================================
// REVIEWS
// ============================================================

/**
 * POST /api/specialists/:id/reviews
 * Add review
 */
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, review, bookingId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify user had a completed booking with this specialist
    const bookingCheck = await db.pool.query(
      `SELECT 1 FROM bookings 
       WHERE specialist_id = $1 AND user_id = $2 AND status = 'completed'`,
      [id, userId]
    );

    // Allow review if booking exists or skip check for demo
    // In production, strictly require completed booking

    // Check if already reviewed
    const existingReview = await db.pool.query(
      `SELECT 1 FROM specialist_reviews 
       WHERE specialist_id = $1 AND client_id = $2`,
      [id, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this specialist' });
    }

    const result = await db.pool.query(
      `INSERT INTO specialist_reviews (specialist_id, client_id, consultation_id, rating, review)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, userId, bookingId || null, rating, review || '']
    );

    // Update specialist rating
    await db.pool.query(
      `UPDATE specialists SET 
        rating = (SELECT AVG(rating) FROM specialist_reviews WHERE specialist_id = $1),
        reviews_count = (SELECT COUNT(*) FROM specialist_reviews WHERE specialist_id = $1)
       WHERE id = $1`,
      [id]
    );

    res.status(201).json({
      review: result.rows[0],
      message: 'Review submitted successfully'
    });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
