/**
 * AI Routes
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Conversations
router.get('/conversations', aiController.getConversations);
router.post('/conversations', aiController.createConversation);

// Messages
router.get('/conversations/:id/messages', aiController.getMessages);
router.post('/conversations/:id/messages', aiController.sendMessage);

// One-off advice
router.post('/ask', aiController.generateHealthAdvice);

module.exports = router;
