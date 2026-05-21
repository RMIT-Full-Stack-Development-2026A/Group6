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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const subscriptionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ['Free', 'Premium'],
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
            default: null,
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
}, {
    timestamps: true,
});
// Index for faster queries
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ displayOrder: 1 });
// Virtual for calculating price per day
subscriptionSchema.virtual('pricePerDay').get(function () {
    if (this.price === 0)
        return '0';
    let days = this.duration.value;
    if (this.duration.unit === 'month') {
        days *= 30;
    }
    else if (this.duration.unit === 'year') {
        days *= 365;
    }
    return (this.price / days).toFixed(2);
});
const Subscription = mongoose_1.default.model('Subscription', subscriptionSchema);
exports.default = Subscription;
//# sourceMappingURL=subscription.model.js.map