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
const playerStatsSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    totalGames: {
        type: Number,
        default: 0,
        min: 0,
    },
    wins: {
        type: Number,
        default: 0,
        min: 0,
    },
    losses: {
        type: Number,
        default: 0,
        min: 0,
    },
    draws: {
        type: Number,
        default: 0,
        min: 0,
    },
    winRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    stats: {
        local: {
            games: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            draws: { type: Number, default: 0 },
        },
        online: {
            games: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            draws: { type: Number, default: 0 },
            ranking: { type: Number, default: 0 },
        },
        bot: {
            games: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            draws: { type: Number, default: 0 },
        },
    },
    currentWinStreak: {
        type: Number,
        default: 0,
    },
    bestWinStreak: {
        type: Number,
        default: 0,
    },
    currentLossStreak: {
        type: Number,
        default: 0,
    },
    favoriteGridSize: {
        type: Number,
        default: null,
    },
    totalPlayTime: {
        type: Number,
        default: 0,
    },
    achievements: [
        {
            type: String,
        },
    ],
    lastPlayed: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
// Indexes
playerStatsSchema.index({ user: 1 });
playerStatsSchema.index({ winRate: -1 });
playerStatsSchema.index({ wins: -1 });
// Virtual to calculate win rate
playerStatsSchema.pre('save', async function () {
    if (this.totalGames > 0) {
        this.winRate = Number(((this.wins / this.totalGames) * 100).toFixed(2));
    }
    else {
        this.winRate = 0;
    }
});
const PlayerStats = mongoose_1.default.model('PlayerStats', playerStatsSchema);
exports.default = PlayerStats;
//# sourceMappingURL=playerStats.model.js.map