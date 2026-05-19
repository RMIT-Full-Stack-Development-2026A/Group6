import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';

const router = Router();

// Public route — anyone can browse active plans
router.get('/active/plans', (req, res) => subscriptionController.getActiveSubscriptions(req, res));

// Authenticated user routes
router.post('/subscribe', authMiddleware, (req, res) => subscriptionController.subscribeUser(req, res));
router.post('/unsubscribe', authMiddleware, (req, res) => subscriptionController.unsubscribeUser(req, res));

router.get('/', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.getAllSubscriptions(req, res));
router.post('/', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.createSubscription(req, res));
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.toggleSubscriptionStatus(req, res));
router.put('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.updateSubscription(req, res));
router.delete('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => subscriptionController.deleteSubscription(req, res));

// Authenticated users can fetch a specific plan by ID
router.get('/:id', authMiddleware, (req, res) => subscriptionController.getSubscriptionById(req, res));

export default router;