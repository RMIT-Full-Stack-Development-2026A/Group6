import { Request, Response } from 'express';
declare class UserController {
    /**
     * Get current user profile
     * @route GET /api/users/profile
     */
    getProfile(req: Request, res: Response): Promise<void>;
    /**
     * Get user by ID (Admin)
     * @route GET /api/users/:id
     */
    getUserById(req: Request, res: Response): Promise<void>;
    /**
     * Update user profile
     * @route PUT /api/users/profile
     */
    updateProfile(req: Request, res: Response): Promise<void>;
    /**
     * Update password
     * @route PUT /api/users/password
     */
    updatePassword(req: Request, res: Response): Promise<void>;
    /**
     * Get all users (Admin)
     * @route GET /api/users
     */
    getAllUsers(req: Request, res: Response): Promise<void>;
    /**
     * Delete user (Admin)
     * @route DELETE /api/users/:id
     */
    deleteUser(req: Request, res: Response): Promise<void>;
    /**
     * Assign subscription to user (Admin)
     * @route PUT /api/users/:id/subscription
     */
    assignSubscription(req: Request, res: Response): Promise<void>;
}
declare const _default: UserController;
export default _default;
