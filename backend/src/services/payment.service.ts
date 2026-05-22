import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';

export interface ProcessPaymentRequest {
  userId: string;
  paymentMethod: string;
  amount: number;
}

export interface ProcessPaymentResponse {
  success: boolean;
  message: string;
  user: IUser;
}

class PaymentService {

  // Validates the payment method, simulates processing, then extends the user's subscription by 30 days
  async processPayment(paymentData: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    if (!paymentData.userId || !paymentData.paymentMethod) {
      throw new Error('User ID and payment method are required');
    }

    const validMethods = ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'];
    if (!validMethods.includes(paymentData.paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    // In production, replace this with a real Stripe or PayPal gateway call
    const paymentSuccessful = await this.simulatePaymentProcessing(
      paymentData.paymentMethod,
      paymentData.amount
    );

    if (!paymentSuccessful) {
      throw new Error('Payment processing failed');
    }

    const user = await userRepository.findById(paymentData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If an existing subscription has not yet expired, extend from its current end date
    const now = new Date();
    const currentExpiry = user.subscriptionExpires && user.subscriptionExpires > now ? user.subscriptionExpires : now;
    const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);

    const updatedUser = await userRepository.update(paymentData.userId, {
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

  // Removes the subscription flag and clears the expiry date
  async cancelSubscription(userId: string): Promise<ProcessPaymentResponse> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await userRepository.update(userId, {
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

  // Placeholder that mimics gateway latency; replace with a real API call in production
  private async simulatePaymentProcessing(method: string, amount: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Processing payment: ${amount} via ${method}`);
    return true;
  }
}

export default new PaymentService();