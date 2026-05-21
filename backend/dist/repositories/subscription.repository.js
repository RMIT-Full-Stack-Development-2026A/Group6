"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
class SubscriptionRepository {
    // Retrieve a subscription plan by its MongoDB `_id`.
    async findById(subscriptionId) {
        return await subscription_model_1.default.findById(subscriptionId);
    }
    // Find a plan by its display name, such as Free or Premium.
    async findByName(name) {
        return await subscription_model_1.default.findOne({ name });
    }
    // Create a new subscription plan document.
    async create(subscriptionData) {
        const subscription = new subscription_model_1.default(subscriptionData);
        return await subscription.save();
    }
    // Perform an update on the subscription plan record.
    async update(subscriptionId, updateData) {
        return await subscription_model_1.default.findByIdAndUpdate(subscriptionId, updateData, {
            new: true,
            runValidators: true,
        });
    }
    async delete(subscriptionId) {
        return await subscription_model_1.default.findByIdAndDelete(subscriptionId);
    }
    // Return all plans, optionally limiting to active ones only.
    async findAll(activeOnly = false) {
        const query = activeOnly ? { isActive: true } : {};
        return await subscription_model_1.default.find(query).sort({ price: 1 });
    }
    // Return only currently active plans for frontend selection.
    async findActive() {
        return await subscription_model_1.default.find({ isActive: true }).sort({ price: 1 });
    }
    async toggleActive(subscriptionId, isActive) {
        return await subscription_model_1.default.findByIdAndUpdate(subscriptionId, { isActive }, { new: true });
    }
}
exports.default = new SubscriptionRepository();
//# sourceMappingURL=subscription.repository.js.map