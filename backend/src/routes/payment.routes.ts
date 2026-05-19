import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.post('/upgrade', authMiddleware, paymentController.upgradeToProSuccess.bind(paymentController));
router.post('/cancel', authMiddleware, paymentController.cancelSubscription.bind(paymentController));

export default router;
