import mongoose, { Document, Schema } from 'mongoose';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface IUserSubscription extends Document {
  user: mongoose.Types.ObjectId;
  subscription: mongoose.Types.ObjectId;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  transactionId?: string;
  cancelledAt?: Date | null;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSubscriptionSchema = new Schema<IUserSubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      default: '',
    },
    transactionId: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSubscriptionSchema.index({ user: 1, status: 1 });
userSubscriptionSchema.index({ endDate: 1 });
userSubscriptionSchema.index({ status: 1 });

// Method to check if subscription is currently active
userSubscriptionSchema.methods.isCurrentlyActive = function (): boolean {
  return this.status === 'active' && new Date() < this.endDate;
};

const UserSubscription = mongoose.model<IUserSubscription>(
  'UserSubscription',
  userSubscriptionSchema
);

export default UserSubscription;