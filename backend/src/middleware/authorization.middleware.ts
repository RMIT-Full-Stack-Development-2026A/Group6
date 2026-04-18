import { Request, Response, NextFunction } from 'express';
import rbacService from '../services/rbac.service';
import { Permission } from '../types/roles';

// Extend Express Request to include user property

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email?: string;
        // TODO: Add more user properties as needed
      };
    }
  }
}

/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role(s)
 * Note: this middleware must be used after the authMiddleware
 * 
 * @param allowedRoles - Roles that are permitted to access the route
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
 * Permission-based authorization middleware
 * Checks if user has specific permission(s)
 * 
 * @param requiredPermissions - Permissions required for access
 * @param requireAll - If true, user needs ALL permissions (AND logic). Default: true
 */
const permissionMiddleware = (requiredPermissions: Permission[], requireAll = true) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const hasAccess = requireAll
      ? rbacService.hasAllPermissions(req.user.role, requiredPermissions)
      : rbacService.hasAnyPermission(req.user.role, requiredPermissions);

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
      return;
    }

    next();
  };
};


//Check if user is admin
export const isAdmin = roleMiddleware('admin');


//Check if user is either user or admin
export const isUser = roleMiddleware('user', 'admin');


//Check if user exists (has valid authentication)
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
    return;
  }
  next();
};

export { roleMiddleware, permissionMiddleware };
export default roleMiddleware;
