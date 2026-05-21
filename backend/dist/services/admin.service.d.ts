import { PaginationResult } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
declare class AdminService {
    getAllUsers(page?: number, limit?: number): Promise<PaginationResult>;
    getUserById(id: string): Promise<IUser>;
    deactivateUser(id: string): Promise<IUser>;
    reactivateUser(id: string): Promise<IUser>;
}
declare const _default: AdminService;
export default _default;
