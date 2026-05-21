"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class PaymentService {
    async processPayment(paymentData) {
        if (!paymentData.userId || !paymentData.paymentMethod) {
            throw new Error('User ID and payment method are required');
        }
        // Validate payment method
        const validMethods = ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'];
        if (!validMethods.includes(paymentData.paymentMethod)) {
            throw new Error('Invalid payment method');
        }
        // Simulate payment processing. In production, integrate with Stripe, PayPal, or another gateway.
        const paymentSuccessful = await this.simulatePaymentProcessing(paymentData.paymentMethod, paymentData.amount);
        if (!paymentSuccessful) {
            throw new Error('Payment processing failed');
        }
        // Load the user via the repository before applying subscription updates.
        const user = await user_repository_1.default.findById(paymentData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const now = new Date();
        const currentExpiry = user.subscriptionExpires && user.subscriptionExpires > now ? user.subscriptionExpires : now;
        const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000); //30 days in millisecond
        const updatedUser = await user_repository_1.default.update(paymentData.userId, {
            subscription: true,
            subscriptionExpires: newExpiry,
        });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return {
            success: true,
            message: 'Payment successful. Your account has been upgraded to Pro!',
            user: updatedUser,
        };
    }
    async cancelSubscription(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        const user = await user_repository_1.default.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = await user_repository_1.default.update(userId, {
            subscription: false,
            subscriptionExpires: null,
        });
        if (!updatedUser) {
            throw new Error('Unable to cancel subscription');
        }
        return {
            success: true,
            message: 'Subscription cancelled successfully.',
            user: updatedUser,
        };
    }
    async simulatePaymentProcessing(method, amount) {
        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Simulate successful payment (in production, this would call payment gateway API)
        console.log(`Processing payment: ${amount} via ${method}`);
        return true;
    }
}
exports.default = new PaymentService();
//# sourceMappingURL=payment.service.js.map