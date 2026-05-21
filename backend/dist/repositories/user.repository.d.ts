import { IUser } from '../models/user.model';
export interface PaginationResult {
    users: IUser[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}
export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    country: string;
    role?: 'player' | 'admin';
    status?: 'active' | 'deactive';
    subscription?: boolean;
    subscriptionExpires?: Date | null;
    profile?: {
        avatar?: string;
        firstName?: string;
        lastName?: string;
        bio?: string;
    };
}
export interface UpdateUserData {
    username?: string;
    email?: string;
    password?: string;
    country?: string;
    role?: 'player' | 'admin';
    subscription?: boolean;
    subscriptionExpires?: Date | null;
    profile?: {
        avatar?: string;
        firstName?: string;
        lastName?: string;
        bio?: string;
        country?: string;
    };
    preferences?: {
        notifications?: boolean;
        soundEffects?: boolean;
        theme?: 'classic' | 'mint' | 'dark';
    };
    isActive?: boolean;
    lastLogin?: Date;
}
declare class UserRepository {
    findById(userId: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    create(userData: CreateUserData): Promise<IUser>;
    update(userId: string, updateData: UpdateUserData): Promise<IUser | null>;
    delete(userId: string): Promise<IUser | null>;
    findAll(page?: number, limit?: number): Promise<PaginationResult>;
    updateLastLogin(userId: string): Promise<IUser | null>;
    updateSubscription(userId: string, subscriptionValue: boolean): Promise<IUser | null>;
}
declare const _default: UserRepository;
export default _default;
