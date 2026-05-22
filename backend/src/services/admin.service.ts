import userRepository, { PaginationResult } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

class AdminService {

  // Returns a paginated list of all users
  async getAllUsers(page: number = 1, limit: number = 10): Promise<PaginationResult> {
    return await userRepository.findAll(page, limit);
  }

  // Returns a single user by ID, throws if not found
  async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Sets both `status` and `isActive` so login checks are consistent
  async deactivateUser(id: string): Promise<IUser> {
    const user = await userRepository.update(id, {  isActive: false });
    if (!user) throw new Error('User not found');
    return user;
  }

  // Restores account access by updating both status and active flag
  async reactivateUser(id: string): Promise<IUser> {
    const user = await userRepository.update(id, { isActive: true });
    if (!user) throw new Error('User not found');
    return user;
  }
}

export default new AdminService();