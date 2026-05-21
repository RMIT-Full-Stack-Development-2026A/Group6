"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetLoginAttempts = exports.recordFailedLogin = exports.accountLockMiddleware = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const user_model_1 = __importDefault(require("../models/user.model"));
// General API rate limiter
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
exports.generalLimiter = generalLimiter;
// Strict rate limiter for authentication endpoints
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 60 seconds
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true, // Don't count successful requests
});
exports.authLimiter = authLimiter;
const LOCK_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;
const accountLockMiddleware = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            next();
            return;
        }
        const user = await user_model_1.default.findOne({ email }).select('+security');
        if (!user) {
            // Don't reveal whether the account exists
            next();
            return;
        }
        const { accountLockedUntil } = user.security;
        if (accountLockedUntil && accountLockedUntil > new Date()) {
            const secondsLeft = Math.ceil((accountLockedUntil.getTime() - Date.now()) / 1000);
            res.status(429).json({
                success: false,
                message: `Account is temporarily locked due to too many failed login attempts. Try again in ${secondsLeft} second(s).`,
            });
            return;
        }
        next();
    }
    catch {
        next();
    }
};
exports.accountLockMiddleware = accountLockMiddleware;
/**
 * Call this in auth.service.ts when a login attempt fails.
 * Increments the counter and locks the account if MAX_ATTEMPTS is reached.
 */
const recordFailedLogin = async (email) => {
    const user = await user_model_1.default.findOne({ email }).select('+security');
    if (!user)
        return;
    const now = new Date();
    const windowStart = new Date(now.getTime() - LOCK_WINDOW_MS);
    // Reset counter if last failure was outside the window
    const lastFailed = user.security.lastFailedAttempt;
    const attemptsInWindow = lastFailed && lastFailed > windowStart
        ? user.security.failedLoginAttempts + 1
        : 1;
    const shouldLock = attemptsInWindow >= MAX_ATTEMPTS;
    await user_model_1.default.findByIdAndUpdate(user._id, {
        'security.failedLoginAttempts': attemptsInWindow,
        'security.lastFailedAttempt': now,
        'security.accountLockedUntil': shouldLock
            ? new Date(now.getTime() + LOCK_WINDOW_MS)
            : null,
    });
};
exports.recordFailedLogin = recordFailedLogin;
/**
 * Call this in auth.service.ts on successful login.
 * Clears all failed-attempt tracking fields.
 */
const resetLoginAttempts = async (userId) => {
    await user_model_1.default.findByIdAndUpdate(userId, {
        'security.failedLoginAttempts': 0,
        'security.lastFailedAttempt': null,
        'security.accountLockedUntil': null,
    });
};
exports.resetLoginAttempts = resetLoginAttempts;
//# sourceMappingURL=rateLimiter.middleware.js.map