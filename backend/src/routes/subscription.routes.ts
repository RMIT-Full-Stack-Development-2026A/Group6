import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';

const router = Router();

router.get('/active/plans', (req, res) => subscriptionController.getActiveSubscriptions(req, res));
router.post('/subscribe', authMiddleware, (req, res) => subscriptionController.subscribeUser(req, res));
router.post('/unsubscribe', authMiddleware, (req, res) => subscriptionController.unsubscribeUser(req, res));
router.get('/', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.getAllSubscriptions(req, res));
router.get('/:id', (req, res) => subscriptionController.getSubscriptionById(req, res));
router.post('/', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.createSubscription(req, res));
router.put('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.updateSubscription(req, res));
router.delete('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.deleteSubscription(req, res));
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.toggleSubscriptionStatus(req, res));

export default router;