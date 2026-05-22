import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import userRepository, { CreateUserData, UpdateUserData, PaginationResult } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

const AVATAR_UPLOAD_DIR = path.join(__dirname, '../../public/avatars');

// Returns true if the string is a base64-encoded image data URL
function isBase64Image(value: string): boolean {
  return /^data:image\/(jpeg|png|webp|gif);base64,/.test(value);
}

// Decodes a base64 image, writes it to disk, and returns the public URL
async function saveAvatarFromBase64(userId: string, avatarData: string, baseUrl: string): Promise<string> {
  const match = avatarData.match(/^data:image\/(jpeg|png|webp|gif);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid avatar data format');
  }

  const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  await fs.mkdir(AVATAR_UPLOAD_DIR, { recursive: true });

  // Filename includes the user ID and a timestamp to avoid collisions
  const filename = `${userId}-${Date.now()}.${extension}`;
  const filepath = path.join(AVATAR_UPLOAD_DIR, filename);
  await fs.writeFile(filepath, buffer);

  return `${baseUrl}/avatars/${filename}`;
}

class UserService {

  // Returns a user by ID or throws if not found
  async getUserById(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Returns a user by email or throws if not found
  async getUserByEmail(email: string): Promise<IUser> {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Creates a user after verifying email and username are not already taken
  async createUser(userData: CreateUserData): Promise<IUser> {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) throw new Error('Username already taken');

    // Password hashing is handled by the pre('save') hook in user.model.ts
    return await userRepository.create(userData);
  }

  // Updates profile fields; strips password and role to prevent privilege escalation
  async updateUser(userId: string, updateData: UpdateUserData, baseUrl: string): Promise<IUser> {
    delete updateData.password;
    delete updateData.role;

    // If a base64 image is provided, save it to disk and replace the field with the URL
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

    const user = await userRepository.update(userId, updateData);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Changes the password after verifying the current one is correct
  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Current password is incorrect');

    // Hash manually here because findByIdAndUpdate bypasses the pre('save') hook
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userRepository.update(userId, { password: hashedPassword });
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  }

  // Permanently removes a user document
  async deleteUser(userId: string): Promise<IUser> {
    const user = await userRepository.delete(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Returns all users with pagination, used by admin endpoints
  async getAllUsers(page: number, limit: number): Promise<PaginationResult> {
    return await userRepository.findAll(page, limit);
  }

  // Sets or clears the subscription flag on a user account
  async assignSubscription(userId: string, isSubscribed: boolean): Promise<IUser> {
    const user = await userRepository.updateSubscription(userId, isSubscribed);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export default new UserService();