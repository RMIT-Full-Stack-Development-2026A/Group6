import bcrypt from 'bcryptjs';
import userRepository, { CreateUserData, UpdateUserData, PaginationResult } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

class UserService {
  async getUserById(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('User not found');
    return user;
  }

  async createUser(userData: CreateUserData): Promise<IUser> {
    const existingEmail = await userRepository.findByEmail(userData.email);
    if (existingEmail) throw new Error('Email already registered');

    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) throw new Error('Username already taken');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await userRepository.create({ ...userData, password: hashedPassword });
  }

  async updateUser(userId: string, updateData: UpdateUserData): Promise<IUser> {
    delete updateData.password;
    delete updateData.role;
    delete updateData.currentSubscription;

    const user = await userRepository.update(userId, updateData);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userRepository.update(userId, { password: hashedPassword });
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<IUser> {
    const user = await userRepository.delete(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async getAllUsers(page: number, limit: number): Promise<PaginationResult> {
    return await userRepository.findAll(page, limit);
  }

  async assignSubscription(userId: string, subscriptionId: string): Promise<IUser> {
    const user = await userRepository.updateSubscription(userId, subscriptionId);
    if (!user) throw new Error('User not found');
    return user;
  }
}

export default new UserService();