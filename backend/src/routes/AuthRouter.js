import express from 'express';
import * as authController from '../controllers/AuthController.js';


const router = express.Router();

// Request
router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/google', authController.googleSignIn);
router.get('/sign-out', authController.signOut);

// Refresh token
router.get('/refresh-token', authController.refreshToken);

export default router;
