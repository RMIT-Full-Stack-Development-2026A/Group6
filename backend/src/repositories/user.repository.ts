import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';

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
  subscription?: boolean;
  subscriptionExpires?: Date | null;
  profile?: {
    avatar?: string;
    firstName?: string;
    lastName?: string;
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
  };
  isActive?: boolean;
  lastLogin?: Date;
}

class UserRepository {
  async findById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async create(userData: CreateUserData): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async update(userId: string, updateData: UpdateUserData): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResult> {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await User.countDocuments();

    return {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateLastLogin(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true }
    );
  }

  async updateSubscription(
    userId: string,
    subscriptionValue: boolean
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { subscription: subscriptionValue },
      { new: true }
    );
  }
}

export default new UserRepository();