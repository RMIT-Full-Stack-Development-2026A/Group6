"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = __importDefault(require("../services/payment.service"));
class PaymentController {
    async upgradeToProSuccess(req, res) {
        try {
            const userId = req.user.id;
            const { paymentMethod } = req.body;
            if (!paymentMethod) {
                res.status(400).json({
                    success: false,
                    message: 'Payment method is required',
                });
                return;
            }
            const result = await payment_service_1.default.processPayment({
                userId,
                paymentMethod,
                amount: 10,
            });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async cancelSubscription(req, res) {
        try {
            const userId = req.user.id;
            const result = await payment_service_1.default.cancelSubscription(userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new PaymentController();
//# sourceMappingURL=payment.controller.js.map