/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role(s)
 * Also, this middleware must be used after the authMiddleware
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 * Convenience function for admin-only routes
 */
const isAdmin = roleMiddleware('admin');

/**
 * Check if user is either user or admin
 * Convenience function for authenticated user routes
 */
const isUser = roleMiddleware('user', 'admin');

module.exports = roleMiddleware;
module.exports.isAdmin = isAdmin;
module.exports.isUser = isUser;