import subscriptionRepository, {
  CreateSubscriptionData,
  UpdateSubscriptionData,
} from '../repositories/subscription.repository';
import userRepository from '../repositories/user.repository';
import { ISubscription } from '../models/subscription.model';
import { IUser } from '../models/user.model';

class SubscriptionService {

  // Returns a single subscription plan or throws if it does not exist
  async getSubscriptionById(subscriptionId: string): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }
    return subscription;
  }

  // Returns all plans; pass activeOnly=true to exclude disabled plans
  async getAllSubscriptions(activeOnly: boolean = false): Promise<ISubscription[]> {
    return await subscriptionRepository.findAll(activeOnly);
  }

  // Convenience wrapper that returns only active plans
  async getActiveSubscriptions(): Promise<ISubscription[]> {
    return await subscriptionRepository.findActive();
  }

  // Creates a new plan after checking that the name is not already in use
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

  // Updates an existing plan; checks for name conflicts if the name is being changed
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

  // Permanently removes a subscription plan
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

  // Enables or disables a plan without deleting it
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

  // Links a user to a subscription plan after confirming the plan is active
  async subscribeUser(userId: string, subscriptionId: string): Promise<IUser> {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    if (!subscription.isActive) {
      throw new Error('This subscription plan is not available');
    }

    // Update subscription flag through the repository layer
    const user = await userRepository.updateSubscription(userId, true);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Removes the subscription flag from the user
  async unsubscribeUser(userId: string): Promise<IUser> {
    const user = await userRepository.updateSubscription(userId, false);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export default new SubscriptionService();