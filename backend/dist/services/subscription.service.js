"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_repository_1 = __importDefault(require("../repositories/subscription.repository"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class SubscriptionService {
    async getSubscriptionById(subscriptionId) {
        const subscription = await subscription_repository_1.default.findById(subscriptionId);
        if (!subscription) {
            throw new Error('Subscription plan not found');
        }
        return subscription;
    }
    async getAllSubscriptions(activeOnly = false) {
        return await subscription_repository_1.default.findAll(activeOnly);
    }
    async getActiveSubscriptions() {
        return await subscription_repository_1.default.findActive();
    }
    async createSubscription(subscriptionData) {
        const existingSubscription = await subscription_repository_1.default.findByName(subscriptionData.name);
        if (existingSubscription) {
            throw new Error('Subscription plan with this name already exists');
        }
        if (subscriptionData.price < 0) {
            throw new Error('Price cannot be negative');
        }
        if (subscriptionData.duration && subscriptionData.duration.value <= 0) {
            throw new Error('Duration value must be positive');
        }
        return await subscription_repository_1.default.create(subscriptionData);
    }
    async updateSubscription(subscriptionId, updateData) {
        const subscription = await subscription_repository_1.default.findById(subscriptionId);
        if (!subscription) {
            throw new Error('Subscription plan not found');
        }
        if (updateData.name && updateData.name !== subscription.name) {
            const existingSubscription = await subscription_repository_1.default.findByName(updateData.name);
            if (existingSubscription) {
                throw new Error('Subscription plan with this name already exists');
            }
        }
        if (updateData.price !== undefined && updateData.price < 0) {
            throw new Error('Price cannot be negative');
        }
        if (updateData.duration && updateData.duration.value <= 0) {
            throw new Error('Duration value must be positive');
        }
        const updated = await subscription_repository_1.default.update(subscriptionId, updateData);
        if (!updated) {
            throw new Error('Subscription plan not found');
        }
        return updated;
    }
    async deleteSubscription(subscriptionId) {
        const subscription = await subscription_repository_1.default.findById(subscriptionId);
        if (!subscription) {
            throw new Error('Subscription plan not found');
        }
        const deleted = await subscription_repository_1.default.delete(subscriptionId);
        if (!deleted) {
            throw new Error('Subscription plan not found');
        }
        return deleted;
    }
    async toggleSubscriptionStatus(subscriptionId, isActive) {
        const subscription = await subscription_repository_1.default.findById(subscriptionId);
        if (!subscription) {
            throw new Error('Subscription plan not found');
        }
        const updated = await subscription_repository_1.default.toggleActive(subscriptionId, isActive);
        if (!updated) {
            throw new Error('Subscription plan not found');
        }
        return updated;
    }
    async subscribeUser(userId, subscriptionId) {
        // Ensure the chosen subscription exists and is active before updating the user.
        const subscription = await subscription_repository_1.default.findById(subscriptionId);
        if (!subscription) {
            throw new Error('Subscription plan not found');
        }
        if (!subscription.isActive) {
            throw new Error('This subscription plan is not available');
        }
        // Update the user's subscription status through the repository layer.
        const user = await user_repository_1.default.updateSubscription(userId, true);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async unsubscribeUser(userId) {
        const user = await user_repository_1.default.updateSubscription(userId, false);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.default = new SubscriptionService();
//# sourceMappingURL=subscription.service.js.map