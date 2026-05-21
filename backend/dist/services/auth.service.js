"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = isTokenBlacklisted;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const tokenBlacklist_model_1 = __importDefault(require("../models/tokenBlacklist.model"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[A-Za-z0-9_-]+$/;
const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_BLOCK_WINDOW_MS = 60 * 1000;
const failedLoginAttempts = new Map();
function resetLoginAttempts(key) {
    failedLoginAttempts.delete(key);
}
function recordFailedLoginAttempt(key) {
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
function isLoginBlocked(key) {
    const attempt = failedLoginAttempts.get(key);
    return !!attempt && attempt.count >= MAX_FAILED_LOGIN_ATTEMPTS && Date.now() - attempt.firstAttempt <= LOGIN_BLOCK_WINDOW_MS;
}
async function isTokenBlacklisted(token) {
    const existing = await tokenBlacklist_model_1.default.exists({ token });
    return Boolean(existing);
}
function validateSignupData(signupData) {
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
    async logout(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        const expiresAt = decoded?.exp
            ? new Date(decoded.exp * 1000)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await tokenBlacklist_model_1.default.findOneAndUpdate({ token }, { token, expiresAt }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    async signup(signupData) {
        validateSignupData(signupData);
        // Use the User repository to check if this email already exists.
        // This centralizes user queries and avoids direct model access from the auth service.
        const existingUser = await user_repository_1.default.findByEmail(signupData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const existingUsername = await user_repository_1.default.findByUsername(signupData.username);
        if (existingUsername) {
            throw new Error('Username already exists');
        }
        const user = await user_repository_1.default.create({
            email: signupData.email,
            username: signupData.username,
            password: signupData.password,
            country: signupData.country,
            role: 'player',
            status: 'active',
            subscription: false,
            subscriptionExpires: null,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '7d' });
        return {
            user: {
                id: user._id.toString(),
                userID: user.userID,
                email: user.email,
                username: user.username,
                country: user.country,
                role: user.role,
                status: user.status,
                subscription: user.subscription,
                subscriptionExpires: user.subscriptionExpires,
            },
            token,
            message: 'User registered successfully',
        };
    }
    async login(loginData) {
        if (!loginData.usernameOrEmail || !loginData.password) {
            throw new Error('Username or email and password are required');
        }
        const identifier = loginData.usernameOrEmail.trim();
        if (!identifier) {
            throw new Error('Username or email is required');
        }
        const normalizedIdentifier = identifier.toLowerCase();
        let user = await user_repository_1.default.findByEmail(normalizedIdentifier);
        if (!user) {
            user = await user_repository_1.default.findByUsername(identifier);
        }
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
        const isPasswordValid = await bcryptjs_1.default.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            const failedCount = recordFailedLoginAttempt(loginKey);
            if (failedCount >= MAX_FAILED_LOGIN_ATTEMPTS) {
                throw new Error('Too many failed login attempts. Please wait 60 seconds before retrying.');
            }
            throw new Error('Invalid credentials');
        }
        resetLoginAttempts(loginKey);
        const token = jsonwebtoken_1.default.sign({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '7d' });
        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                role: user.role,
                subscription: user.subscription,
                subscriptionExpires: user.subscriptionExpires,
            },
            token,
            message: 'Login successful',
        };
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map