"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post('/upgrade', auth_middleware_1.default, payment_controller_1.default.upgradeToProSuccess);
router.post('/cancel', auth_middleware_1.default, payment_controller_1.default.cancelSubscription);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map