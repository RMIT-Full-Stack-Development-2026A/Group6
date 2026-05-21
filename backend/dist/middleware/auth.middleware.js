"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const auth_service_1 = require("../services/auth.service");
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.',
            });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.',
            });
            return;
        }
        if (await (0, auth_service_1.isTokenBlacklisted)(token)) {
            res.status(401).json({
                success: false,
                message: 'Token has been invalidated. Please login again.',
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_repository_1.default.findById(decoded.id);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found. Authorization denied.',
            });
            return;
        }
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: 'Account is inactive. Please contact support.',
            });
            return;
        }
        req.user = {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                message: 'Invalid token. Authorization denied.',
            });
            return;
        }
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.',
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Server error during authentication.',
        });
    }
};
/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't reject if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.substring(7);
        if (!token) {
            return next();
        }
        if (await (0, auth_service_1.isTokenBlacklisted)(token)) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_repository_1.default.findById(decoded.id);
        if (user && user.isActive) {
            req.user = {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                role: user.role,
            };
        }
        next();
    }
    catch (error) {
        // If token is invalid, just continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map