"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
// Blocks access when user does not hold an active premium subscription
const premiumMiddleware = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
    }
    const user = await user_repository_1.default.findById(req.user.id);
    if (!user) {
        res.status(401).json({ success: false, message: 'User not found.' });
        return;
    }
    const isPremium = user.subscription === true &&
        user.subscriptionExpires !== null &&
        new Date() < new Date(user.subscriptionExpires);
    if (!isPremium) {
        res.status(403).json({
            success: false,
            message: 'Premium subscription required to access this feature.',
        });
        return;
    }
    next();
};
exports.default = premiumMiddleware;
//# sourceMappingURL=premium.middleware.js.map