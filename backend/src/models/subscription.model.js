const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: ['Free', 'Basic', 'Premium', 'Enterprise'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        enum: ['day', 'month', 'year'],
        required: true,
      },
    },
    features: {
      maxGames: {
        type: Number,
        default: null, // null means unlimited
      },
      multiplayerAccess: {
        type: Boolean,
        default: false,
      },
      premiumSupport: {
        type: Boolean,
        default: false,
      },
      adFree: {
        type: Boolean,
        default: false,
      },
      customThemes: {
        type: Boolean,
        default: false,
      },
      priorityAccess: {
        type: Boolean,
        default: false,
      },
      cloudSave: {
        type: Boolean,
        default: false,
      },
    },
    benefits: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
subscriptionSchema.index({ name: 1 });
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ displayOrder: 1 });

// Virtual for calculating price per day
subscriptionSchema.virtual('pricePerDay').get(function () {
  if (this.price === 0) return 0;
  
  let days = this.duration.value;
  if (this.duration.unit === 'month') {
    days *= 30;
  } else if (this.duration.unit === 'year') {
    days *= 365;
  }
  
  return (this.price / days).toFixed(2);
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;