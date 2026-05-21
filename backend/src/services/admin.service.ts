import userRepository, { PaginationResult } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

class AdminService {
  async getAllUsers(page: number = 1, limit: number = 10): Promise<PaginationResult> {
    return await userRepository.findAll(page, limit);
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async deactivateUser(id: string): Promise<IUser> {
    const user = await userRepository.update(id, { isActive: false });
    if (!user) throw new Error('User not found');
    return user;
  }

  async reactivateUser(id: string): Promise<IUser> {
    const user = await userRepository.update(id, { isActive: true });
    if (!user) throw new Error('User not found');
    return user;
  }
}

export default new AdminService();