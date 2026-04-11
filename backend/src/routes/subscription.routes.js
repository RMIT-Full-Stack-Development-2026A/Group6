const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/active/plans', subscriptionController.getActiveSubscriptions);
router.post('/subscribe', authMiddleware, subscriptionController.subscribeUser);
router.post('/unsubscribe', authMiddleware, subscriptionController.unsubscribeUser);
router.get('/', authMiddleware, roleMiddleware('admin'), subscriptionController.getAllSubscriptions);
router.get('/:id', subscriptionController.getSubscriptionById);
router.post('/', authMiddleware, roleMiddleware('admin'), subscriptionController.createSubscription);
router.put('/:id', authMiddleware, roleMiddleware('admin'), subscriptionController.updateSubscription);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), subscriptionController.deleteSubscription);
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), subscriptionController.toggleSubscriptionStatus);

module.exports = router;