"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class AdminService {
    async getAllUsers(page = 1, limit = 10) {
        return await user_repository_1.default.findAll(page, limit);
    }
    async getUserById(id) {
        const user = await user_repository_1.default.findById(id);
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async deactivateUser(id) {
        const user = await user_repository_1.default.update(id, { isActive: false });
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async reactivateUser(id) {
        const user = await user_repository_1.default.update(id, { isActive: true });
        if (!user)
            throw new Error('User not found');
        return user;
    }
}
exports.default = new AdminService();
//# sourceMappingURL=admin.service.js.map