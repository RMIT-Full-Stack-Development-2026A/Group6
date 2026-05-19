import express, { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter.middleware';


const router: Router = express.Router();

router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
