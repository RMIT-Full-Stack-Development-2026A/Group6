import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernameRegex = /^[A-Za-z0-9_-]+$/
const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  country: string;
}

export interface SignupResponse {
  user: {
    id: string;
    userID: string; 
    email: string;
    username: string;
    country: string;
    role: string;
  };
  token: string;
  message: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
  token: string;
  message: string;
}

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_BLOCK_WINDOW_MS = 60 * 1000;

const failedLoginAttempts = new Map<string, { count: number; firstAttempt: number }>();

function resetLoginAttempts(key: string): void {
  failedLoginAttempts.delete(key);
}

function recordFailedLoginAttempt(key: string): number {
  const now = Date.now();
  const attempt = failedLoginAttempts.get(key);

  if (!attempt || now - attempt.firstAttempt > LOGIN_BLOCK_WINDOW_MS) {
    failedLoginAttempts.set(key, { count: 1, firstAttempt: now });
    return 1;
  }

  attempt.count += 1;
  failedLoginAttempts.set(key, attempt);
  return attempt.count;
}

function isLoginBlocked(key: string): boolean {
  const attempt = failedLoginAttempts.get(key);
  return !!attempt && attempt.count >= MAX_FAILED_LOGIN_ATTEMPTS && Date.now() - attempt.firstAttempt <= LOGIN_BLOCK_WINDOW_MS;
}

const tokenBlacklist = new Set<string>();

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

function validateSignupData(signupData: SignupRequest): void {
  if (!signupData.email || !signupData.password || !signupData.username || !signupData.country) {
    throw new Error('Email, username, password, and country are required');
  }

  if (signupData.email.length > 254) {
    throw new Error('Email must be less than 255 characters');
  }

  if (signupData.email.includes(' ')) {
    throw new Error('Email cannot contain spaces');
  }

  const atCount = signupData.email.split('@').length - 1;
  if (atCount !== 1) {
    throw new Error("Email must contain exactly one '@' symbol");
  }

  const parts = signupData.email.split('@');
  const domain = parts[1];
  if (!domain || !domain.includes('.')) {
    throw new Error("Email must contain a '.' after the '@' symbol");
  }

  if (!emailRegex.test(signupData.email)) {
    throw new Error('Enter a valid email address, for example name@example.com');
  }

  if (!usernameRegex.test(signupData.username)) {
    throw new Error('Username may only contain letters, numbers, underscore, and hyphen');
  }

  if (signupData.username.length < 3 || signupData.username.length > 30) {
    throw new Error('Username must be 3 to 30 characters');
  }

  if (signupData.password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  if (!/[0-9]/.test(signupData.password)) {
    throw new Error('Password must include at least one number');
  }

  if (!/[A-Z]/.test(signupData.password)) {
    throw new Error('Password must include at least one uppercase letter');
  }

  if (!specialCharRegex.test(signupData.password)) {
    throw new Error('Password must include at least one special character like $#@!');
  }
}


class AuthService {
  async logout(token: string): Promise<void> {
    tokenBlacklist.add(token);
  }

  async signup(signupData: SignupRequest): Promise<SignupResponse> {
    
    validateSignupData(signupData);

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
        role: user.role,
      }, 
      token,
      message: 'User registered successfully',
    };
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    if (!loginData.usernameOrEmail || !loginData.password) {
      throw new Error('Username or email and password are required');
    }

    const identifier = loginData.usernameOrEmail.trim();
    if (!identifier) {
      throw new Error('Username or email is required');
    }

    const normalizedIdentifier = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: identifier },
      ],
    });

    const loginKey = user ? user._id.toString() : normalizedIdentifier;

    if (isLoginBlocked(loginKey)) {
      throw new Error('Too many failed login attempts. Please wait 60 seconds before retrying.');
    }

    if (!user) {
      const failedCount = recordFailedLoginAttempt(loginKey);
      if (failedCount >= MAX_FAILED_LOGIN_ATTEMPTS) {
        throw new Error('Too many failed login attempts. Please wait 60 seconds before retrying.');
      }
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      const failedCount = recordFailedLoginAttempt(loginKey);
      if (failedCount >= MAX_FAILED_LOGIN_ATTEMPTS) {
        throw new Error('Too many failed login attempts. Please wait 60 seconds before retrying.');
      }
      throw new Error('Invalid credentials');
    }

    resetLoginAttempts(loginKey);

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
      },
      token,
      message: 'Login successful',
    };
  }
}

export default new AuthService();
