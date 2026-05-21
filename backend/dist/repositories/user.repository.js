"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepository {
    async findById(userId) {
        return await user_model_1.default.findById(userId);
    }
    async findByEmail(email) {
        return await user_model_1.default.findOne({ email });
    }
    async findByUsername(username) {
        return await user_model_1.default.findOne({ username });
    }
    async create(userData) {
        const user = new user_model_1.default({
            ...userData,
            status: userData.status ?? 'active',
        });
        return await user.save();
    }
    async update(userId, updateData) {
        const flat = {};
        const { profile, preferences, ...topLevel } = updateData;
        for (const [k, v] of Object.entries(topLevel)) {
            if (v !== undefined)
                flat[k] = v;
        }
        if (profile) {
            for (const [k, v] of Object.entries(profile)) {
                if (v !== undefined)
                    flat[`profile.${k}`] = v;
            }
        }
        if (preferences) {
            for (const [k, v] of Object.entries(preferences)) {
                if (v !== undefined)
                    flat[`preferences.${k}`] = v;
            }
        }
        return await user_model_1.default.findByIdAndUpdate(userId, { $set: flat }, {
            new: true,
            runValidators: true,
        });
    }
    async delete(userId) {
        return await user_model_1.default.findByIdAndDelete(userId);
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const users = await user_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await user_model_1.default.countDocuments();
        return { users, pagination: { total, page, pages: Math.ceil(total / limit) } };
    }
    async updateLastLogin(userId) {
        return await user_model_1.default.findByIdAndUpdate(userId, { lastLogin: new Date() }, { new: true });
    }
    async updateSubscription(userId, subscriptionValue) {
        return await user_model_1.default.findByIdAndUpdate(userId, { subscription: subscriptionValue }, { new: true });
    }
}
exports.default = new UserRepository();
//# sourceMappingURL=user.repository.js.map