import { Request, Response, NextFunction } from 'express';
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't reject if no token
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authMiddleware;
