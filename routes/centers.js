/**
 * Centers Routes
 * Health centers directory and booking API
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
 * GET /api/centers
 * List centers with filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      type,
      city,
      country,
      minRating,
      search,
      lat,
      lng,
      radius = 50, // km
      sort = 'rating',
      limit = 20,
      offset = 0
    } = req.query;

    let whereClause = ['is_active = true'];
    const values = [];
    let paramIndex = 1;

    if (type) {
      whereClause.push(`type = $${paramIndex}`);
      values.push(type);
      paramIndex++;
    }

    if (city) {
      whereClause.push(`city ILIKE $${paramIndex}`);
      values.push(`%${city}%`);
      paramIndex++;
    }

    if (country) {
      whereClause.push(`country ILIKE $${paramIndex}`);
      values.push(`%${country}%`);
      paramIndex++;
    }

    if (minRating) {
      whereClause.push(`rating >= $${paramIndex}`);
      values.push(parseFloat(minRating));
      paramIndex++;
    }

    if (search) {
      whereClause.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR $${paramIndex} = ANY(amenities))`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Sort options
    const sortOptions = {
      'rating': 'rating DESC, reviews_count DESC',
      'newest': 'created_at DESC',
      'name': 'name ASC',
      'distance': 'distance ASC'
    };

    let orderBy = sortOptions[sort] || sortOptions.rating;
    let selectDistance = '';

    // Distance calculation if coordinates provided
    if (lat && lng) {
      selectDistance = `,
        (6371 * acos(
          cos(radians($${paramIndex})) * cos(radians(coordinates[1])) *
          cos(radians(coordinates[0]) - radians($${paramIndex + 1})) +
          sin(radians($${paramIndex})) * sin(radians(coordinates[1]))
        )) as distance`;
      values.push(parseFloat(lat), parseFloat(lng));
      paramIndex += 2;

      whereClause.push(`coordinates IS NOT NULL`);
      orderBy = 'distance ASC';
    }

    const whereStr = whereClause.join(' AND ');
    values.push(parseInt(limit), parseInt(offset));

    const centersResult = await db.pool.query(
      `SELECT *${selectDistance}
       FROM centers
       WHERE ${whereStr}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    const countResult = await db.pool.query(
      `SELECT COUNT(*) FROM centers WHERE ${whereStr}`,
      values.slice(0, -2)
    );

    // Get types with counts
    const typesResult = await db.pool.query(
      `SELECT type, COUNT(*) as count
       FROM centers
       WHERE is_active = true
       GROUP BY type
       ORDER BY count DESC`
    );

    // Get cities with counts
    const citiesResult = await db.pool.query(
      `SELECT city, country, COUNT(*) as count
       FROM centers
       WHERE is_active = true AND city IS NOT NULL
       GROUP BY city, country
       ORDER BY count DESC
       LIMIT 20`
    );

    res.json({
      centers: centersResult.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters: {
        types: typesResult.rows,
        cities: citiesResult.rows
      }
    });
  } catch (err) {
    console.error('Get centers error:', err);
    res.status(500).json({ error: 'Failed to fetch centers' });
  }
});

/**
 * GET /api/centers/types
 * Get center types
 */
router.get('/filters/types', async (req, res) => {
  try {
    const types = [
      { id: 'gym', name: 'Gym & Fitness', icon: 'dumbbell' },
      { id: 'spa', name: 'Spa & Wellness', icon: 'sparkles' },
      { id: 'clinic', name: 'Medical Clinic', icon: 'stethoscope' },
      { id: 'wellness_center', name: 'Wellness Center', icon: 'heart' },
      { id: 'yoga_studio', name: 'Yoga Studio', icon: 'flower' },
      { id: 'meditation_center', name: 'Meditation Center', icon: 'brain' },
      { id: 'pilates_studio', name: 'Pilates Studio', icon: 'activity' },
      { id: 'sports_center', name: 'Sports Center', icon: 'trophy' }
    ];

    res.json({ types });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch types' });
  }
});

/**
 * GET /api/centers/map
 * Get centers for map view (simplified data)
 */
router.get('/map', async (req, res) => {
  try {
    const { bounds, type } = req.query;
    
    let whereClause = 'is_active = true AND coordinates IS NOT NULL';
    const values = [];

    if (type) {
      whereClause += ` AND type = $1`;
      values.push(type);
    }

    // Parse bounds if provided (ne_lat, ne_lng, sw_lat, sw_lng)
    if (bounds) {
      const [neLat, neLng, swLat, swLng] = bounds.split(',').map(Number);
      whereClause += ` AND coordinates[1] BETWEEN ${swLng} AND ${neLng}
                       AND coordinates[0] BETWEEN ${swLat} AND ${neLat}`;
    }

    const result = await db.pool.query(
      `SELECT id, name, type, coordinates, rating, photos
       FROM centers
       WHERE ${whereClause}
       LIMIT 500`,
      values
    );

    res.json({
      centers: result.rows.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        lat: c.coordinates[0],
        lng: c.coordinates[1],
        rating: c.rating,
        photo: c.photos?.[0] || null
      }))
    });
  } catch (err) {
    console.error('Get map centers error:', err);
    res.status(500).json({ error: 'Failed to fetch centers' });
  }
});

/**
 * GET /api/centers/:id
 * Get center details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const centerResult = await db.pool.query(
      'SELECT * FROM centers WHERE id = $1 AND is_active = true',
      [id]
    );

    if (centerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    const center = centerResult.rows[0];

    // Get services
    const servicesResult = await db.pool.query(
      `SELECT * FROM center_services 
       WHERE center_id = $1 AND is_active = true
       ORDER BY category, name`,
      [id]
    );

    // Get reviews
    const reviewsResult = await db.pool.query(
      `SELECT cr.*, u.full_name, u.avatar_url
       FROM center_reviews cr
       JOIN users u ON cr.user_id = u.id
       WHERE cr.center_id = $1 AND cr.is_public = true
       ORDER BY cr.created_at DESC
       LIMIT 10`,
      [id]
    );

    // Get nearby centers
    const nearbyResult = await db.pool.query(
      `SELECT id, name, type, coordinates, rating, photos
       FROM centers
       WHERE id != $1 AND is_active = true AND coordinates IS NOT NULL
       ORDER BY coordinates <-> $2::point
       LIMIT 4`,
      [id, center.coordinates]
    );

    res.json({
      center: {
        ...center,
        coordinates: center.coordinates ? {
          lat: center.coordinates[0],
          lng: center.coordinates[1]
        } : null
      },
      services: servicesResult.rows,
      reviews: reviewsResult.rows,
      nearbyCenters: nearbyResult.rows.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        lat: c.coordinates[0],
        lng: c.coordinates[1],
        rating: c.rating,
        photo: c.photos?.[0] || null
      }))
    });
  } catch (err) {
    console.error('Get center error:', err);
    res.status(500).json({ error: 'Failed to fetch center' });
  }
});

/**
 * GET /api/centers/:id/availability
 * Get center availability
 */
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId, date, days = 7 } = req.query;

    const startDate = date ? new Date(date) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(days));

    // Get existing bookings
    const bookingsResult = await db.pool.query(
      `SELECT scheduled_at, duration_minutes 
       FROM bookings 
       WHERE center_id = $1 
       AND scheduled_at >= $2 
       AND scheduled_at < $3
       AND status NOT IN ('cancelled', 'no_show')`,
      [id, startDate, endDate]
    );

    const bookedSlots = bookingsResult.rows.map(b => ({
      start: new Date(b.scheduled_at),
      end: new Date(new Date(b.scheduled_at).getTime() + b.duration_minutes * 60000)
    }));

    // Generate available slots (simplified - assuming 9 AM to 6 PM availability)
    const availableSlots = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay();
      
      // Skip Sundays or configure per center
      if (dayOfWeek !== 0) {
        const hours = [9, 10, 11, 12, 14, 15, 16, 17]; // 9 AM - 6 PM with lunch break
        
        for (const hour of hours) {
          const slotTime = new Date(currentDate);
          slotTime.setHours(hour, 0, 0, 0);
          
          const slotEnd = new Date(slotTime.getTime() + 60 * 60000);
          
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
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      slots: availableSlots.slice(0, 30)
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
 * POST /api/centers/:id/book
 * Book a center service
 */
router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      serviceId,
      scheduledAt,
      duration,
      timezone = 'UTC',
      clientNotes,
      paymentMethod = 'stripe'
    } = req.body;

    if (!scheduledAt) {
      return res.status(400).json({ error: 'Scheduled time is required' });
    }

    let serviceName = 'General Visit';
    let price = 0;
    let durationMinutes = duration || 60;
    let currency = 'USD';

    // If service specified, get details
    if (serviceId) {
      const serviceResult = await db.pool.query(
        'SELECT * FROM center_services WHERE id = $1 AND center_id = $2 AND is_active = true',
        [serviceId, id]
      );

      if (serviceResult.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const service = serviceResult.rows[0];
      serviceName = service.name;
      price = service.price || 0;
      durationMinutes = service.duration_minutes || duration || 60;
      currency = service.currency;
    }

    // Check if slot is available
    const bookingCheck = await db.pool.query(
      `SELECT 1 FROM bookings 
       WHERE center_id = $1 
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
        booking_number, type, center_id, service_id, user_id,
        service_name, scheduled_at, duration_minutes, timezone, price, currency,
        meeting_type, client_notes, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        bookingNumber, 'center', id, serviceId || null, userId,
        serviceName, scheduledAt, durationMinutes, timezone, price, currency,
        'in_person', clientNotes, price > 0 ? 'pending' : 'paid'
      ]
    );

    const booking = bookingResult.rows[0];

    // Create payment intent if needed
    let paymentIntent = null;
    if (price > 0 && paymentMethod === 'stripe' && process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100),
        currency: currency.toLowerCase(),
        metadata: {
          booking_id: booking.id,
          booking_number: bookingNumber,
          user_id: userId,
          type: 'center_booking'
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
          name: serviceName,
          duration: durationMinutes
        }
      },
      payment: paymentIntent ? {
        clientSecret: paymentIntent.client_secret,
        amount: price,
        currency: currency
      } : null
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

function generateBookingNumber() {
  const prefix = 'CN';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ============================================================
// REVIEWS
// ============================================================

/**
 * POST /api/centers/:id/reviews
 * Add center review
 */
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, review, bookingId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user has a completed booking at this center
    const bookingCheck = await db.pool.query(
      `SELECT 1 FROM bookings 
       WHERE center_id = $1 AND user_id = $2 AND status = 'completed'`,
      [id, userId]
    );

    // Check if already reviewed
    const existingReview = await db.pool.query(
      `SELECT 1 FROM center_reviews 
       WHERE center_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this center' });
    }

    const result = await db.pool.query(
      `INSERT INTO center_reviews (center_id, user_id, booking_id, rating, review)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, userId, bookingId || null, rating, review || '']
    );

    // Update center rating
    await db.pool.query(
      `UPDATE centers SET 
        rating = (SELECT AVG(rating) FROM center_reviews WHERE center_id = $1),
        reviews_count = (SELECT COUNT(*) FROM center_reviews WHERE center_id = $1)
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

// ============================================================
// ADMIN ROUTES
// ============================================================

/**
 * POST /api/centers
 * Create center (admin)
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      address,
      city,
      country,
      coordinates,
      phone,
      email,
      website,
      photos,
      services,
      amenities
    } = req.body;

    const result = await db.pool.query(
      `INSERT INTO centers (
        name, description, type, address, city, country, coordinates,
        phone, email, website, photos, services, amenities
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        name, description, type, address, city, country,
        coordinates ? `(${coordinates.lat},${coordinates.lng})` : null,
        phone, email, website, photos || [], services || {}, amenities || []
      ]
    );

    res.status(201).json({ center: result.rows[0] });
  } catch (err) {
    console.error('Create center error:', err);
    res.status(500).json({ error: 'Failed to create center' });
  }
});

module.exports = router;
