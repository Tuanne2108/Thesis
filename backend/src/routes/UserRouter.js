import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';
import * as userController from '../controllers/UserController.js';

const router = express.Router();

// Request
router.put('/update-user/:id', authenticateToken, userController.updateUser);
router.delete('/delete-user/:id', authenticateToken, userController.deleteUser);
router.post('/become-seller', authenticateToken, userController.becomeSeller);

export default router;
