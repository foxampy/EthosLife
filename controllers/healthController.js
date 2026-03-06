/**
 * Health Controller - Dashboard, Metrics, Goals
 */

const db = require('../database');

// Get dashboard data
async function getDashboard(req, res) {
  try {
    const userId = req.user.id;
    
    // Get latest metrics
    const metricsResult = await db.pool.query(
      `SELECT category, metric_type, value, unit, recorded_at
       FROM health_metrics
       WHERE user_id = $1
       ORDER BY recorded_at DESC
       LIMIT 20`,
      [userId]
    );
    
    // Get goals
    const goalsResult = await db.pool.query(
      `SELECT * FROM goals
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC`,
      [userId]
    );
    
    // Get health profile
    const profileResult = await db.pool.query(
      'SELECT * FROM health_profiles WHERE user_id = $1',
      [userId]
    );
    
    // Calculate health score
    const healthScore = await calculateHealthScore(userId);
    
    // Get recent symptoms
    const symptomsResult = await db.pool.query(
      `SELECT * FROM symptoms
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );
    
    res.json({
      success: true,
      dashboard: {
        healthScore,
        recentMetrics: metricsResult.rows,
        goals: goalsResult.rows,
        profile: profileResult.rows[0] || null,
        activeSymptoms: symptomsResult.rows
      }
    });
    
  } catch (err) {
    console.error('Get dashboard error:', err);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
}

// Calculate health score (0-100)
async function calculateHealthScore(userId) {
  try {
    let score = 50; // Base score
    
    // Get latest weight for BMI
    const weightResult = await db.pool.query(
      `SELECT value FROM health_metrics
       WHERE user_id = $1 AND category = 'weight'
       ORDER BY recorded_at DESC LIMIT 1`,
      [userId]
    );
    
    // Get sleep data
    const sleepResult = await db.pool.query(
      `SELECT AVG(value) as avg_sleep
       FROM health_metrics
       WHERE user_id = $1 AND category = 'sleep'
       AND recorded_at > CURRENT_DATE - INTERVAL '7 days'`,
      [userId]
    );
    
    // Get activity data
    const activityResult = await db.pool.query(
      `SELECT AVG(value) as avg_steps
       FROM health_metrics
       WHERE user_id = $1 AND metric_type = 'steps'
       AND recorded_at > CURRENT_DATE - INTERVAL '7 days'`,
      [userId]
    );
    
    // BMI calculation (simplified)
    if (weightResult.rows.length > 0) {
      const weight = parseFloat(weightResult.rows[0].value);
      // Assume average height 170cm if not set
      const height = 1.70;
      const bmi = weight / (height * height);
      
      if (bmi >= 18.5 && bmi <= 25) score += 15;
      else if (bmi >= 17 && bmi <= 30) score += 10;
      else score += 5;
    }
    
    // Sleep score
    if (sleepResult.rows[0]?.avg_sleep) {
      const avgSleep = parseFloat(sleepResult.rows[0].avg_sleep);
      if (avgSleep >= 7 && avgSleep <= 9) score += 15;
      else if (avgSleep >= 6) score += 10;
      else score += 5;
    }
    
    // Activity score
    if (activityResult.rows[0]?.avg_steps) {
      const avgSteps = parseFloat(activityResult.rows[0].avg_steps);
      if (avgSteps >= 10000) score += 15;
      else if (avgSteps >= 7000) score += 10;
      else if (avgSteps >= 5000) score += 5;
    }
    
    // Cap at 100
    return Math.min(100, Math.max(0, Math.round(score)));
    
  } catch (err) {
    console.error('Health score calculation error:', err);
    return 50;
  }
}

// Get health score endpoint
async function getHealthScore(req, res) {
  try {
    const userId = req.user.id;
    const score = await calculateHealthScore(userId);
    
    res.json({
      success: true,
      score,
      maxScore: 100
    });
    
  } catch (err) {
    console.error('Get health score error:', err);
    res.status(500).json({ error: 'Failed to calculate health score' });
  }
}

// Get metrics
async function getMetrics(req, res) {
  try {
    const userId = req.user.id;
    const { category, metricType, days = 30 } = req.query;
    
    let query = `
      SELECT * FROM health_metrics
      WHERE user_id = $1
      AND recorded_at > CURRENT_DATE - INTERVAL '${days} days'
    `;
    const params = [userId];
    
    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    if (metricType) {
      query += ` AND metric_type = $${params.length + 1}`;
      params.push(metricType);
    }
    
    query += ' ORDER BY recorded_at DESC';
    
    const result = await db.pool.query(query, params);
    
    res.json({
      success: true,
      metrics: result.rows
    });
    
  } catch (err) {
    console.error('Get metrics error:', err);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
}

// Add metric
async function addMetric(req, res) {
  try {
    const userId = req.user.id;
    const { category, metricType, value, unit, notes, recordedAt } = req.body;
    
    if (!category || !metricType || value === undefined) {
      return res.status(400).json({ error: 'Category, metric type, and value required' });
    }
    
    const result = await db.pool.query(
      `INSERT INTO health_metrics (user_id, category, metric_type, value, unit, notes, recorded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, category, metricType, value, unit || null, notes || null, recordedAt || new Date()]
    );
    
    res.json({
      success: true,
      metric: result.rows[0]
    });
    
  } catch (err) {
    console.error('Add metric error:', err);
    res.status(500).json({ error: 'Failed to add metric' });
  }
}

// Get goals
async function getGoals(req, res) {
  try {
    const userId = req.user.id;
    const { status = 'active' } = req.query;
    
    let query = 'SELECT * FROM goals WHERE user_id = $1';
    const params = [userId];
    
    if (status !== 'all') {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.pool.query(query, params);
    
    res.json({
      success: true,
      goals: result.rows
    });
    
  } catch (err) {
    console.error('Get goals error:', err);
    res.status(500).json({ error: 'Failed to get goals' });
  }
}

// Add goal
async function addGoal(req, res) {
  try {
    const userId = req.user.id;
    const { category, title, description, targetValue, unit, deadline } = req.body;
    
    if (!category || !title || targetValue === undefined) {
      return res.status(400).json({ error: 'Category, title, and target value required' });
    }
    
    const result = await db.pool.query(
      `INSERT INTO goals (user_id, category, title, description, target_value, unit, deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, category, title, description || null, targetValue, unit || null, deadline || null]
    );
    
    res.json({
      success: true,
      goal: result.rows[0]
    });
    
  } catch (err) {
    console.error('Add goal error:', err);
    res.status(500).json({ error: 'Failed to add goal' });
  }
}

// Update goal
async function updateGoal(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { currentValue, status } = req.body;
    
    // Check if goal exists and belongs to user
    const checkResult = await db.pool.query(
      'SELECT * FROM goals WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const updates = [];
    const params = [id];
    let paramIndex = 2;
    
    if (currentValue !== undefined) {
      updates.push(`current_value = $${paramIndex++}`);
      params.push(currentValue);
    }
    
    if (status) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const result = await db.pool.query(
      `UPDATE goals SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      params
    );
    
    res.json({
      success: true,
      goal: result.rows[0]
    });
    
  } catch (err) {
    console.error('Update goal error:', err);
    res.status(500).json({ error: 'Failed to update goal' });
  }
}

// Get or create health profile
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    
    let result = await db.pool.query(
      'SELECT * FROM health_profiles WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      // Create empty profile
      result = await db.pool.query(
        'INSERT INTO health_profiles (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
    }
    
    res.json({
      success: true,
      profile: result.rows[0]
    });
    
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

// Update health profile
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    const allowedFields = [
      'birth_date', 'gender', 'height_cm', 'weight_kg', 'blood_type',
      'activity_level', 'sleep_hours_avg', 'smoking_status', 'alcohol_frequency',
      'conditions', 'allergies', 'medications', 'surgeries', 'family_history', 'goals'
    ];
    
    const setClauses = [];
    const params = [userId];
    let paramIndex = 2;
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setClauses.push(`${key} = $${paramIndex++}`);
        params.push(value);
      }
    }
    
    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Check if profile exists
    let result = await db.pool.query(
      'SELECT id FROM health_profiles WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      // Create new profile
      result = await db.pool.query(
        `INSERT INTO health_profiles (user_id, ${Object.keys(updates).filter(k => allowedFields.includes(k)).join(', ')})
         VALUES ($1, ${setClauses.map((_, i) => `$${i + 2}`).join(', ')})
         RETURNING *`,
        params
      );
    } else {
      // Update existing
      result = await db.pool.query(
        `UPDATE health_profiles
         SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1
         RETURNING *`,
        params
      );
    }
    
    res.json({
      success: true,
      profile: result.rows[0]
    });
    
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

module.exports = {
  getDashboard,
  getHealthScore,
  getMetrics,
  addMetric,
  getGoals,
  addGoal,
  updateGoal,
  getProfile,
  updateProfile
};
