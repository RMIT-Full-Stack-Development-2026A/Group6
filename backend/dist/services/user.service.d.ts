import { CreateUserData, UpdateUserData, PaginationResult } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
declare class UserService {
    getUserById(userId: string): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser>;
    createUser(userData: CreateUserData): Promise<IUser>;
    updateUser(userId: string, updateData: UpdateUserData, baseUrl: string): Promise<IUser>;
    updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUser>;
    deleteUser(userId: string): Promise<IUser>;
    getAllUsers(page: number, limit: number): Promise<PaginationResult>;
    assignSubscription(userId: string, isSubscribed: boolean): Promise<IUser>;
}
declare const _default: UserService;
export default _default;
