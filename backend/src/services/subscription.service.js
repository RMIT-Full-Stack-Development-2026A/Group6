const subscriptionRepository = require('../repositories/subscription.repository');
const userRepository = require('../repositories/user.repository');

class SubscriptionService {
  /* Get subscription by ID*/
  async getSubscriptionById(subscriptionId) {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }
    return subscription;
  }

  /* Get all subscriptions */
  async getAllSubscriptions(activeOnly = false) {
    return await subscriptionRepository.findAll(activeOnly);
  }

  /* Get active subscriptions */
  async getActiveSubscriptions() {
    return await subscriptionRepository.findActive();
  }

  /* Create new subscription plan */
  async createSubscription(subscriptionData) {
    // Check if subscription with same name already exists
    const existingSubscription = await subscriptionRepository.findByName(
      subscriptionData.name
    );
    if (existingSubscription) {
      throw new Error('Subscription plan with this name already exists');
    }

    // Validate price
    if (subscriptionData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Validate duration
    if (subscriptionData.duration && subscriptionData.duration.value <= 0) {
      throw new Error('Duration value must be positive');
    }

    const subscription = await subscriptionRepository.create(subscriptionData);
    return subscription;
  }

  /*Update subscription plan*/
  async updateSubscription(subscriptionId, updateData) {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== subscription.name) {
      const existingSubscription = await subscriptionRepository.findByName(
        updateData.name
      );
      if (existingSubscription) {
        throw new Error('Subscription plan with this name already exists');
      }
    }

    // Validate price if provided
    if (updateData.price !== undefined && updateData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Validate duration if provided
    if (updateData.duration && updateData.duration.value <= 0) {
      throw new Error('Duration value must be positive');
    }

    return await subscriptionRepository.update(subscriptionId, updateData);
  }

  /* Delete subscription plan */
  async deleteSubscription(subscriptionId) {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }


    return await subscriptionRepository.delete(subscriptionId);
  }

  /* Toggle subscription active status */
  async toggleSubscriptionStatus(subscriptionId, isActive) {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    return await subscriptionRepository.toggleActive(subscriptionId, isActive);
  }

  /* Subscribe user to a plan*/
  async subscribeUser(userId, subscriptionId) {
    // Verify subscription exists and is active
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    if (!subscription.isActive) {
      throw new Error('This subscription plan is not available');
    }

    // Update user's subscription
    const user = await userRepository.updateSubscription(userId, subscriptionId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /* Unsubscribe user */
  async unsubscribeUser(userId) {
    const user = await userRepository.updateSubscription(userId, null);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new SubscriptionService();