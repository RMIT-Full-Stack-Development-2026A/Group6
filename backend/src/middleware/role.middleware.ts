import { Request, Response, NextFunction } from 'express';

/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role(s)
 * Note: this middleware must be used after the authMiddleware
 */
const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
      return;
    }

    next();
  };
};

/**
 * Check if user is admin
 * Convenience middleware for admin-only routes
 */
export const isAdmin = roleMiddleware('admin');

/**
 * Check if user is either user or admin
 * Convenience middleware for authenticated user routes
 */
export const isUser = roleMiddleware('user', 'admin');

export default roleMiddleware;