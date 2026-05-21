import { Request, Response, NextFunction } from 'express';
declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const accountLockMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Call this in auth.service.ts when a login attempt fails.
 * Increments the counter and locks the account if MAX_ATTEMPTS is reached.
 */
declare const recordFailedLogin: (email: string) => Promise<void>;
/**
 * Call this in auth.service.ts on successful login.
 * Clears all failed-attempt tracking fields.
 */
declare const resetLoginAttempts: (userId: string) => Promise<void>;
export { generalLimiter, authLimiter, accountLockMiddleware, recordFailedLogin, resetLoginAttempts };
