import express, { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter.middleware';


const router: Router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

export default router;
