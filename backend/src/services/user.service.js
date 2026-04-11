const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User data
   */
  async getUserByEmail(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Create new user
   * @param {Object} userData - User data (username, email, password)
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.role;
    delete updateData.subscription;

    const user = await userRepository.update(userId, updateData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Updated user
   */
  async updatePassword(userId, oldPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    return await userRepository.update(userId, { password: hashedPassword });
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async deleteUser(userId) {
    const user = await userRepository.delete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get all users (with pagination)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Users and pagination
   */
  async getAllUsers(page, limit) {
    return await userRepository.findAll(page, limit);
  }

  /**
   * Update user's subscription
   * @param {string} userId - User ID
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Updated user
   */
  async assignSubscription(userId, subscriptionId) {
    const user = await userRepository.updateSubscription(userId, subscriptionId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();