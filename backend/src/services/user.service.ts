import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import userRepository, { CreateUserData, UpdateUserData, PaginationResult } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

const AVATAR_UPLOAD_DIR = path.join(__dirname, '../../public/avatars');

function isBase64Image(value: string): boolean {
  return /^data:image\/(jpeg|png|webp|gif);base64,/.test(value);
}

async function saveAvatarFromBase64(userId: string, avatarData: string, baseUrl: string): Promise<string> {
  const match = avatarData.match(/^data:image\/(jpeg|png|webp|gif);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid avatar data format');
  }

  const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  await fs.mkdir(AVATAR_UPLOAD_DIR, { recursive: true });

  const filename = `${userId}-${Date.now()}.${extension}`;
  const filepath = path.join(AVATAR_UPLOAD_DIR, filename);
  await fs.writeFile(filepath, buffer);

  return `${baseUrl}/avatars/${filename}`;
}

class UserService {
  async getUserById(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(userData: CreateUserData): Promise<IUser> {
    // Validate uniqueness before creating a new user, using repository methods
    // so all database lookup logic remains centralized in the repository layer.
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    const user = await userRepository.create({
      ...userData,
      currentSubscription: userData.currentSubscription ?? null,
    });

    return user;
  }

  async updateUser(userId: string, updateData: UpdateUserData, baseUrl: string): Promise<IUser> {
    // Remove sensitive fields that shouldn't be updated directly from the profile.
    // Password updates should go through a dedicated password flow.
    delete updateData.password;
    delete updateData.role;
    delete updateData.subscription;

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
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await userRepository.update(userId, { password: hashedPassword });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const user = await userRepository.delete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllUsers(page: number, limit: number): Promise<PaginationResult> {
    return await userRepository.findAll(page, limit);
  }

  async assignSubscription(userId: string, isSubscribed: boolean): Promise<IUser> {
    const user = await userRepository.updateSubscription(userId, isSubscribed);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deactivateUser(userId: string): Promise<IUser> {
    const user = await userRepository.update(userId, { status: 'deactive', isActive: false });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async reactivateUser(userId: string): Promise<IUser> {
    const user = await userRepository.update(userId, { status: 'active', isActive: true });
    if (!user) { 
      throw new Error('User not found');
    }
    return user;
  }
}

export default new UserService();