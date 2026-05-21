import mongoose, { Document, Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

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

const userSchema = new Schema<IUser>(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomUUID(),
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
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });


// Hash password before saving
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});


// Remove sensitive fields from API responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.security;

  return user;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;