"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const AVATAR_UPLOAD_DIR = path_1.default.join(__dirname, '../../public/avatars');
function isBase64Image(value) {
    return /^data:image\/(jpeg|png|webp|gif);base64,/.test(value);
}
async function saveAvatarFromBase64(userId, avatarData, baseUrl) {
    const match = avatarData.match(/^data:image\/(jpeg|png|webp|gif);base64,(.+)$/);
    if (!match) {
        throw new Error('Invalid avatar data format');
    }
    const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buffer = Buffer.from(match[2], 'base64');
    await fs_1.promises.mkdir(AVATAR_UPLOAD_DIR, { recursive: true });
    const filename = `${userId}-${Date.now()}.${extension}`;
    const filepath = path_1.default.join(AVATAR_UPLOAD_DIR, filename);
    await fs_1.promises.writeFile(filepath, buffer);
    return `${baseUrl}/avatars/${filename}`;
}
class UserService {
    async getUserById(userId) {
        const user = await user_repository_1.default.findById(userId);
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async getUserByEmail(email) {
        const user = await user_repository_1.default.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async createUser(userData) {
        // Validate uniqueness before creating a new user, using repository methods
        // so all database lookup logic remains centralized in the repository layer.
        const existingUser = await user_repository_1.default.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const existingUsername = await user_repository_1.default.findByUsername(userData.username);
        if (existingUsername)
            throw new Error('Username already taken');
        // Password is hashed by the pre('save') hook in user.model.ts — do NOT hash here
        return await user_repository_1.default.create(userData);
    }
    async updateUser(userId, updateData, baseUrl) {
        // Remove sensitive fields that shouldn't be updated directly from the profile.
        // Password updates should go through a dedicated password flow.
        delete updateData.password;
        delete updateData.role;
        if (updateData.profile?.avatar && isBase64Image(updateData.profile.avatar)) {
            const avatarUrl = await saveAvatarFromBase64(userId, updateData.profile.avatar, baseUrl);
            updateData = {
                ...updateData,
                profile: {
                    ...updateData.profile,
                    avatar: avatarUrl,
                },
            };
        }
        const user = await user_repository_1.default.update(userId, updateData);
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async updatePassword(userId, oldPassword, newPassword) {
        const user = await user_repository_1.default.findById(userId);
        if (!user)
            throw new Error('User not found');
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch)
            throw new Error('Current password is incorrect');
        // Hash manually here because we're using findByIdAndUpdate (bypasses pre('save') hook)
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        const updatedUser = await user_repository_1.default.update(userId, { password: hashedPassword });
        if (!updatedUser)
            throw new Error('User not found');
        return updatedUser;
    }
    async deleteUser(userId) {
        const user = await user_repository_1.default.delete(userId);
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async getAllUsers(page, limit) {
        return await user_repository_1.default.findAll(page, limit);
    }
    async assignSubscription(userId, isSubscribed) {
        const user = await user_repository_1.default.updateSubscription(userId, isSubscribed);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map