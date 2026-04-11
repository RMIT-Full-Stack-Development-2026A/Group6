const subscriptionService = require('../services/subscription.service');

/* Subscription Controller */
class SubscriptionController {
    /* Get all subscription plans */
    async getAllSubscriptions(req, res) {
        try {
            const activeOnly = req.query.active === 'true';
            const subscriptions = await subscriptionService.getAllSubscriptions(activeOnly);
            
            res.status(200).json({
                success: true,
                data: subscriptions,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Get subscription plan by ID */
    async getSubscriptionById(req, res) {
        try {
            const { id } = req.params;
            const subscription = await subscriptionService.getSubscriptionById(id);
            
            res.status(200).json({
                success: true,
                data: subscription,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Get active subscription plans (for users to browse) */
    async getActiveSubscriptions(req, res) {
        try {
            const subscriptions = await subscriptionService.getActiveSubscriptions();
            
            res.status(200).json({
                success: true,
                data: subscriptions,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Create new subscription plan (Admin) */
    async createSubscription(req, res) {
        try {
            const subscriptionData = req.body;
            const subscription = await subscriptionService.createSubscription(subscriptionData);
            
            res.status(201).json({
                success: true,
                message: 'Subscription plan created successfully',
                data: subscription,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Update subscription plan (Admin) */
    async updateSubscription(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const subscription = await subscriptionService.updateSubscription(id, updateData);
            
            res.status(200).json({
                success: true,
                message: 'Subscription plan updated successfully',
                data: subscription,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Delete subscription plan (Admin) */
    async deleteSubscription(req, res) {
        try {
            const { id } = req.params;
            await subscriptionService.deleteSubscription(id);
            
            res.status(200).json({
                success: true,
                message: 'Subscription plan deleted successfully',
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Toggle subscription status (Admin) */
    async toggleSubscriptionStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            
            if (typeof isActive !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'isActive must be a boolean value',
                });
            }

            const subscription = await subscriptionService.toggleSubscriptionStatus(id, isActive);
            
            res.status(200).json({
                success: true,
                message: `Subscription plan ${isActive ? 'activated' : 'deactivated'} successfully`,
                data: subscription,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Subscribe current user to a plan */
    async subscribeUser(req, res) {
        try {
            const userId = req.user.id; 
            const { subscriptionId } = req.body;
            
            if (!subscriptionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Subscription ID is required',
                });
            }

            const user = await subscriptionService.subscribeUser(userId, subscriptionId);
            
            res.status(200).json({
                success: true,
                message: 'Successfully subscribed to plan',
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /* Unsubscribe current user */
    async unsubscribeUser(req, res) {
        try {
            const userId = req.user.id;
            const user = await subscriptionService.unsubscribeUser(userId);
            
            res.status(200).json({
                success: true,
                message: 'Successfully unsubscribed from plan',
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new SubscriptionController();
