"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_service_1 = __importDefault(require("../services/subscription.service"));
class SubscriptionController {
    /* Get all subscription plans */
    async getAllSubscriptions(req, res) {
        try {
            const activeOnly = req.query.active === 'true';
            const subscriptions = await subscription_service_1.default.getAllSubscriptions(activeOnly);
            res.status(200).json({
                success: true,
                data: subscriptions,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /* Get subscription plan by ID */
    async getSubscriptionById(req, res) {
        try {
            const id = req.params.id;
            const subscription = await subscription_service_1.default.getSubscriptionById(id);
            res.status(200).json({
                success: true,
                data: subscription,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
    /* Get active subscription plans (for users to browse) */
    async getActiveSubscriptions(req, res) {
        try {
            const subscriptions = await subscription_service_1.default.getActiveSubscriptions();
            res.status(200).json({
                success: true,
                data: subscriptions,
            });
        }
        catch (error) {
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
            const subscription = await subscription_service_1.default.createSubscription(subscriptionData);
            res.status(201).json({
                success: true,
                message: 'Subscription plan created successfully',
                data: subscription,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    /* Update subscription plan (Admin) */
    async updateSubscription(req, res) {
        try {
            const id = req.params.id;
            const updateData = req.body;
            const subscription = await subscription_service_1.default.updateSubscription(id, updateData);
            res.status(200).json({
                success: true,
                message: 'Subscription plan updated successfully',
                data: subscription,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    /* Delete subscription plan (Admin) */
    async deleteSubscription(req, res) {
        try {
            const id = req.params.id;
            await subscription_service_1.default.deleteSubscription(id);
            res.status(200).json({
                success: true,
                message: 'Subscription plan deleted successfully',
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
    /* Toggle subscription status (Admin) */
    async toggleSubscriptionStatus(req, res) {
        try {
            const id = req.params.id;
            const { isActive } = req.body;
            if (typeof isActive !== 'boolean') {
                res.status(400).json({
                    success: false,
                    message: 'isActive must be a boolean value',
                });
                return;
            }
            const subscription = await subscription_service_1.default.toggleSubscriptionStatus(id, isActive);
            res.status(200).json({
                success: true,
                message: `Subscription plan ${isActive ? 'activated' : 'deactivated'} successfully`,
                data: subscription,
            });
        }
        catch (error) {
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
                res.status(400).json({
                    success: false,
                    message: 'Subscription ID is required',
                });
                return;
            }
            const user = await subscription_service_1.default.subscribeUser(userId, subscriptionId);
            res.status(200).json({
                success: true,
                message: 'Successfully subscribed to plan',
                data: user,
            });
        }
        catch (error) {
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
            const user = await subscription_service_1.default.unsubscribeUser(userId);
            res.status(200).json({
                success: true,
                message: 'Successfully unsubscribed from plan',
                data: user,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new SubscriptionController();
//# sourceMappingURL=subscription.controller.js.map