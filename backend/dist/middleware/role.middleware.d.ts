import { Request, Response, NextFunction } from 'express';
/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role(s)
 * Note: this middleware must be used after authMiddleware
 */
declare const roleMiddleware: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Check if user is admin
 */
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Check if user is a player or admin
 */
export declare const isPlayer: (req: Request, res: Response, next: NextFunction) => void;
export default roleMiddleware;
