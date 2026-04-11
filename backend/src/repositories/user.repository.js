const User = require('../models/user.model');

class UserRepository {
  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  async findById(userId) {
    return await User.findById(userId).populate('subscription');
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User object
   */
  async findByUsername(username) {
    return await User.findOne({ username });
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Update user by ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async update(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).populate('subscription');
  }

  /**
   * Delete user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async delete(userId) {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Get all users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Users and pagination info
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .populate('subscription')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await User.countDocuments();

    return {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user's last login
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user
   */
  async updateLastLogin(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true }
    );
  }

  /**
   * Update user's subscription
   * @param {string} userId - User ID
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Updated user
   */
  async updateSubscription(userId, subscriptionId) {
    return await User.findByIdAndUpdate(
      userId,
      { subscription: subscriptionId },
      { new: true }
    ).populate('subscription');
  }
}

module.exports = new UserRepository();