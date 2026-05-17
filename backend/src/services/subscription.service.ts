import subscriptionRepository, {
  CreateSubscriptionData,
  UpdateSubscriptionData,
} from '../repositories/subscription.repository';
import userRepository from '../repositories/user.repository';
import { ISubscription } from '../models/subscription.model';
import { IUser } from '../models/user.model';

class SubscriptionService {
  async getSubscriptionById(subscriptionId: string): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }
    return subscription;
  }

  async getAllSubscriptions(activeOnly: boolean = false): Promise<ISubscription[]> {
    return await subscriptionRepository.findAll(activeOnly);
  }

  async getActiveSubscriptions(): Promise<ISubscription[]> {
    return await subscriptionRepository.findActive();
  }

  async createSubscription(subscriptionData: CreateSubscriptionData): Promise<ISubscription> {
    const existingSubscription = await subscriptionRepository.findByName(subscriptionData.name);
    if (existingSubscription) {
      throw new Error('Subscription plan with this name already exists');
    }

    if (subscriptionData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (subscriptionData.duration && subscriptionData.duration.value <= 0) {
      throw new Error('Duration value must be positive');
    }

    return await subscriptionRepository.create(subscriptionData);
  }

  async updateSubscription(
    subscriptionId: string,
    updateData: UpdateSubscriptionData
  ): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    if (updateData.name && updateData.name !== subscription.name) {
      const existingSubscription = await subscriptionRepository.findByName(updateData.name);
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

    const updated = await subscriptionRepository.update(subscriptionId, updateData);
    if (!updated) {
      throw new Error('Subscription plan not found');
    }
    return updated;
  }

  async deleteSubscription(subscriptionId: string): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    const deleted = await subscriptionRepository.delete(subscriptionId);
    if (!deleted) {
      throw new Error('Subscription plan not found');
    }
    return deleted;
  }

  async toggleSubscriptionStatus(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    const updated = await subscriptionRepository.toggleActive(subscriptionId, isActive);
    if (!updated) {
      throw new Error('Subscription plan not found');
    }
    return updated;
  }

  async subscribeUser(userId: string, subscriptionId: string): Promise<IUser> {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    if (!subscription.isActive) {
      throw new Error('This subscription plan is not available');
    }

    const user = await userRepository.updateSubscription(userId, true);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async unsubscribeUser(userId: string): Promise<IUser> {
    const user = await userRepository.updateSubscription(userId, false);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export default new SubscriptionService();