/**
 * Health Routes
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Dashboard
router.get('/dashboard', healthController.getDashboard);
router.get('/score', healthController.getHealthScore);

// Metrics
router.get('/metrics', healthController.getMetrics);
router.post('/metrics', healthController.addMetric);

// Goals
router.get('/goals', healthController.getGoals);
router.post('/goals', healthController.addGoal);
router.put('/goals/:id', healthController.updateGoal);

// Profile
router.get('/profile', healthController.getProfile);
router.put('/profile', healthController.updateProfile);

module.exports = router;
