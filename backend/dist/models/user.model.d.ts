import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    userID: string;
    username: string;
    email: string;
    password: string;
    country: string;
    role: 'player' | 'admin';
    status: 'active' | 'deactive';
    subscription: boolean;
    subscriptionExpires: Date | null;
    security: {
        failedLoginAttempts: number;
        lastFailedAttempt: Date | null;
        accountLockedUntil: Date | null;
    };
    profile: {
        avatar: string;
        firstName: string;
        lastName: string;
        bio: string;
    };
    preferences: {
        notifications: boolean;
        soundEffects: boolean;
        theme: 'classic' | 'mint' | 'dark';
    };
    isActive: boolean;
    isEmailVerified: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default User;
