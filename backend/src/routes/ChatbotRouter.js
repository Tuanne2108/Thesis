import express from 'express';
import * as chatController from '../controllers/ChatController.js';
import { authenticateToken } from '../middleware/authToken.js';

const router = express.Router();

// Request
router.post('/chat', chatController.handleChatRequest);
router.get('/history', authenticateToken, chatController.getChatHistory);
router.delete('/history', authenticateToken, chatController.clearChatHistory);

export default router;
