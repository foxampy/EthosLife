/**
 * Auth Routes
 * Full authentication system for EthosLife
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// ============================================================
// EMAIL/PASSWORD AUTH
// ============================================================

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login with email/password
router.post('/login', authController.login);

// POST /api/auth/verify-email - Verify email address
router.post('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-verification - Resend verification email
router.post('/resend-verification', authController.resendVerification);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password - Reset password with code
router.post('/reset-password', authController.resetPassword);

// ============================================================
// OAUTH
// ============================================================

// POST /api/auth/google - Google OAuth login
router.post('/google', authController.googleAuth);

// POST /api/auth/telegram - Telegram login
router.post('/telegram', authController.telegramAuth);

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout - Logout current device
router.post('/logout', authController.logout);

// POST /api/auth/logout-all - Logout all devices (protected)
router.post('/logout-all', authenticateToken, authController.logoutAll);

// ============================================================
// USER PROFILE
// ============================================================

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticateToken, authController.getMe);

// PUT /api/auth/profile - Update profile (protected)
router.put('/profile', authenticateToken, authController.updateProfile);

// POST /api/auth/change-password - Change password (protected)
router.post('/change-password', authenticateToken, authController.changePassword);

// ============================================================
// REFERRALS
// ============================================================

// GET /api/auth/referrals - Get my referrals (protected)
router.get('/referrals', authenticateToken, authController.getMyReferrals);

module.exports = router;
