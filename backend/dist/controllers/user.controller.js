"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    /**
     * Get current user profile
     * @route GET /api/users/profile
     */
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await user_service_1.default.getUserById(userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get user by ID (Admin)
     * @route GET /api/users/:id
     */
    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await user_service_1.default.getUserById(id);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Update user profile
     * @route PUT /api/users/profile
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = req.body;
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const user = await user_service_1.default.updateUser(userId, updateData, baseUrl);
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Update password
     * @route PUT /api/users/password
     */
    async updatePassword(req, res) {
        try {
            const userId = req.user.id;
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Old password and new password are required',
                });
                return;
            }
            await user_service_1.default.updatePassword(userId, oldPassword, newPassword);
            res.status(200).json({
                success: true,
                message: 'Password updated successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get all users (Admin)
     * @route GET /api/users
     */
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await user_service_1.default.getAllUsers(page, limit);
            res.status(200).json({
                success: true,
                data: result.users,
                pagination: result.pagination,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Delete user (Admin)
     * @route DELETE /api/users/:id
     */
    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            await user_service_1.default.deleteUser(id);
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Assign subscription to user (Admin)
     * @route PUT /api/users/:id/subscription
     */
    async assignSubscription(req, res) {
        try {
            const id = req.params.id;
            const { subscription } = req.body;
            if (typeof subscription !== 'boolean') {
                res.status(400).json({
                    success: false,
                    message: 'Subscription value must be true or false',
                });
                return;
            }
            const user = await user_service_1.default.assignSubscription(id, subscription);
            res.status(200).json({
                success: true,
                message: 'Subscription assigned successfully',
                data: user,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map