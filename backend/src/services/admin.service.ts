import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';

class AdminService {
  async getAllUsers(): Promise<IUser[]> {
    const result = await userRepository.findAll(1, 1000);
    return result.users;
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