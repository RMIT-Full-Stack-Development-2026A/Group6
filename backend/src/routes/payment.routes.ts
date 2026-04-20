import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.post('/upgrade', authMiddleware, paymentController.upgradeToProSuccess.bind(paymentController));

export default router;
