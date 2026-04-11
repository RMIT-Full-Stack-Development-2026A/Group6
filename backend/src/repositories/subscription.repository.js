const Subscription = require('../models/subscription.model');

class SubscriptionRepository {
  /**
   * Find subscription by ID
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Subscription object
   */
  async findById(subscriptionId) {
    return await Subscription.findById(subscriptionId);
  }

  /**
   * Find subscription by name
   * @param {string} name - Subscription name
   * @returns {Promise<Object>} Subscription object
   */
  async findByName(name) {
    return await Subscription.findOne({ name });
  }

  /**
   * Create new subscription plan
   * @param {Object} subscriptionData - Subscription data
   * @returns {Promise<Object>} Created subscription
   */
  async create(subscriptionData) {
    const subscription = new Subscription(subscriptionData);
    return await subscription.save();
  }

  /**
   * Update subscription by ID
   * @param {string} subscriptionId - Subscription ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated subscription
   */
  async update(subscriptionId, updateData) {
    return await Subscription.findByIdAndUpdate(subscriptionId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete subscription by ID
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Deleted subscription
   */
  async delete(subscriptionId) {
    return await Subscription.findByIdAndDelete(subscriptionId);
  }

  /**
   * Get all subscriptions
   * @param {boolean} activeOnly - Filter for active subscriptions only
   * @returns {Promise<Array>} List of subscriptions
   */
  async findAll(activeOnly = false) {
    const query = activeOnly ? { isActive: true } : {};
    return await Subscription.find(query).sort({ price: 1 });
  }

  /**
   * Get active subscriptions
   * @returns {Promise<Array>} List of active subscriptions
   */
  async findActive() {
    return await Subscription.find({ isActive: true }).sort({ price: 1 });
  }

  /**
   * Toggle subscription active status
   * @param {string} subscriptionId - Subscription ID
   * @param {boolean} isActive - Active status
   * @returns {Promise<Object>} Updated subscription
   */
  async toggleActive(subscriptionId, isActive) {
    return await Subscription.findByIdAndUpdate(
      subscriptionId,
      { isActive },
      { new: true }
    );
  }
}

module.exports = new SubscriptionRepository();