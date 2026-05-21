import mongoose, { Document, Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

import { v4 as uuidv4 } from 'uuid';

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
  currentSubscription: string | null;
  profile: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
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
      default: () => uuidv4(),
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
      maxlength:254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
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
    subscription: {
      type: Boolean,
      default: false,
    },
    subscriptionExpires: {
      type: Date,
      default: null,
    },
    currentSubscription: {
      type: String,
      default: null,
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
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Hash password before saving
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method to exclude password from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model<IUser>('User', userSchema, 'users'); 

export default User;