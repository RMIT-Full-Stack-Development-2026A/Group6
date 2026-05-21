import { Request, Response } from 'express';
import userService from '../services/user.service';
import { env } from '../config/env';

class UserController {
  /**
   * Get current user profile
   * @route GET /api/users/profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await userService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /**
   * Get user by ID (Admin)
   * @route GET /api/users/:id
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /**
   * Update user profile
   * @route PUT /api/users/profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const updateData = req.body;
      const baseUrl = env.BASE_URL || `${req.protocol}://${req.get('host')}`;

      const user = await userService.updateUser(userId, updateData, baseUrl);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /**
   * Update password
   * @route PUT /api/users/password
   */
  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Old password and new password are required',
        });
        return;
      }

      await userService.updatePassword(userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /**
   * Get all users (Admin)
   * @route GET /api/users
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /**
   * Delete user (Admin)
   * @route DELETE /api/users/:id
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /**
   * Assign subscription to user (Admin)
   * @route PUT /api/users/:id/subscription
   */
  async assignSubscription(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { subscription } = req.body;

      if (typeof subscription !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'Subscription value must be true or false',
        });
        return;
      }

      const user = await userService.assignSubscription(id, subscription);

      res.status(200).json({
        success: true,
        message: 'Subscription assigned successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}

export default new UserController();