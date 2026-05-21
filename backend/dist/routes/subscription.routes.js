"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = __importDefault(require("../controllers/subscription.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const router = (0, express_1.Router)();
// Public route — anyone can browse active plans
router.get('/active/plans', (req, res) => subscription_controller_1.default.getActiveSubscriptions(req, res));
// Authenticated user routes
router.post('/subscribe', auth_middleware_1.default, (req, res) => subscription_controller_1.default.subscribeUser(req, res));
router.post('/unsubscribe', auth_middleware_1.default, (req, res) => subscription_controller_1.default.unsubscribeUser(req, res));
router.get('/', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => subscription_controller_1.default.getAllSubscriptions(req, res));
router.post('/', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => subscription_controller_1.default.createSubscription(req, res));
router.patch('/:id/status', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => subscription_controller_1.default.toggleSubscriptionStatus(req, res));
router.put('/:id', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => subscription_controller_1.default.updateSubscription(req, res));
router.delete('/:id', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => subscription_controller_1.default.deleteSubscription(req, res));
// Authenticated users can fetch a specific plan by ID
router.get('/:id', auth_middleware_1.default, (req, res) => subscription_controller_1.default.getSubscriptionById(req, res));
exports.default = router;
//# sourceMappingURL=subscription.routes.js.map