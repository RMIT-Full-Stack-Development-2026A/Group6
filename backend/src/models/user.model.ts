import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  country: string; 
  role: 'player' | 'admin';
  currentSubscription: mongoose.Types.ObjectId | null;
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
    theme: 'light' | 'dark' | 'auto';
  };
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    country: { type: String, required: true, trim: true }, // top-level (SRS 1.1.1)
    role: { type: String, enum: ['player', 'admin'], default: 'player' },
    currentSubscription: { type: Schema.Types.ObjectId, ref: 'UserSubscription', default: null },
    security: {
      failedLoginAttempts: { type: Number, default: 0, min: 0 },
      lastFailedAttempt: { type: Date, default: null },
      accountLockedUntil: { type: Date, default: null },
    },
    profile: {
      avatar: { type: String, default: '' },
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      bio: { type: String, default: '', maxlength: 500 },
     
    },
    preferences: {
      notifications: { type: Boolean, default: true },
      soundEffects: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Hash password before insert 
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Strip sensitive fields from JSON responses 
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.security;
  return user;
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;