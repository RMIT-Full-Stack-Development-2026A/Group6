import mongoose, { Document, Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  userID: number;
  username: string;
  email: string;
  password: string;
  country: string;
  role: 'player' | 'admin';
  status: 'active' | 'deactive';
  subscription: boolean;
  subscriptionExpires: Date | null;
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
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
userSchema.pre('save', async function () {
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

const counterSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  { collection: 'counters' }
);

const Counter = mongoose.model('Counter', counterSchema);

userSchema.pre('validate', async function () {
  if (!this.isNew) {
    return;
  }

  const counter = await Counter.findOneAndUpdate(
    { id: 'userID' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.userID = counter.seq;
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;