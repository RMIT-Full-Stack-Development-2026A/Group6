"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlayer = exports.isAdmin = void 0;
/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role(s)
 * Note: this middleware must be used after authMiddleware
 */
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.isAdmin = roleMiddleware('admin');
/**
 * Check if user is a player or admin
 */
exports.isPlayer = roleMiddleware('player', 'admin');
exports.default = roleMiddleware;
//# sourceMappingURL=role.middleware.js.map