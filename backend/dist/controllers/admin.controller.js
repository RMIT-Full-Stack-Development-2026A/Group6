"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_service_1 = __importDefault(require("../services/admin.service"));
class AdminController {
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await admin_service_1.default.getAllUsers(page, limit);
            res.status(200).json({ success: true, data: result.users, pagination: result.pagination });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await admin_service_1.default.getUserById(req.params.id);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
    async deactivateUser(req, res) {
        try {
            const user = await admin_service_1.default.deactivateUser(req.params.id);
            res.status(200).json({ success: true, message: 'User deactivated', data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async reactivateUser(req, res) {
        try {
            const user = await admin_service_1.default.reactivateUser(req.params.id);
            res.status(200).json({ success: true, message: 'User reactivated', data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
exports.default = new AdminController();
//# sourceMappingURL=admin.controller.js.map