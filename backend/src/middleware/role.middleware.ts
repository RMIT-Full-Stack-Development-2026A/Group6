// restricts routes to users whose role matches the allowed list
import { Request, Response, NextFunction } from 'express';

/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role(s)
 * Note: this middleware must be used after authMiddleware
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
 */
export const isAdmin = roleMiddleware('admin');

/**
 * Check if user is a player or admin
 */
export const isPlayer = roleMiddleware('player', 'admin');

export default roleMiddleware;