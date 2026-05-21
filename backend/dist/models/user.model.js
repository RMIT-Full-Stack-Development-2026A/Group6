"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: () => crypto_1.default.randomUUID(),
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[A-Za-z0-9_-]+$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['player', 'admin'],
        default: 'player',
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    subscription: {
        type: Boolean,
        default: false,
    },
    subscriptionExpires: {
        type: Date,
        default: null,
    },
    security: {
        failedLoginAttempts: {
            type: Number,
            default: 0,
            min: 0,
            select: false,
        },
        lastFailedAttempt: {
            type: Date,
            default: null,
            select: false,
        },
        accountLockedUntil: {
            type: Date,
            default: null,
            select: false,
        },
    },
    profile: {
        avatar: {
            type: String,
            default: '',
        },
        firstName: {
            type: String,
            default: '',
        },
        lastName: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
            maxlength: 500,
        },
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true,
        },
        soundEffects: {
            type: Boolean,
            default: true,
        },
        theme: {
            type: String,
            enum: ['classic', 'mint', 'dark'],
            default: 'classic',
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
// Remove sensitive fields from API responses
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.security;
    return user;
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map