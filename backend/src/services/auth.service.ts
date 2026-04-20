import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  country: string;
}

export interface SignupResponse {
  user: {
    id: string;
    userID: number;
    email: string;
    username: string;
    country: string;
    role: string;
    status: string;
    subscription: boolean;
  };
  token: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    subscription: boolean;
  };
  token: string;
  message: string;
}

class AuthService {
  async signup(signupData: SignupRequest): Promise<SignupResponse> {
    if (!signupData.email || !signupData.password || !signupData.username || !signupData.country) {
      throw new Error('Email, username, password, and country are required');
    }

    // Check if email exists
    const existingUser = await User.findOne({ email: signupData.email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username: signupData.username });
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Save user to MongoDB
    const user = new User({
      email: signupData.email,
      username: signupData.username,
      password: signupData.password,
      country: signupData.country,
      role: 'player',
      status: 'active',
      subscription: false,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user._id.toString(),
        userID: user.userID,
        email: user.email,
        username: user.username,
        country: user.country,
        subscription: user.subscription,
        role: user.role,
        status: user.status,
      },
      token,
      message: 'User registered successfully',
    };
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    if (!loginData.email || !loginData.password) {
      throw new Error('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        subscription: user.subscription,
      },
      token,
      message: 'Login successful',
    };
  }
}

export default new AuthService();
