/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/google
router.post('/google', authController.googleAuth);

// POST /api/auth/telegram
router.post('/telegram', authController.telegramAuth);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me (protected)
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
