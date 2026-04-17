import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayerStats extends Document {
  user: mongoose.Types.ObjectId;
  
  // Overall statistics
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  
  // Per game mode statistics
  stats: {
    local: {
      games: number;
      wins: number;
      losses: number;
      draws: number;
    };
    online: {
      games: number;
      wins: number;
      losses: number;
      draws: number;
      ranking: number;
      
    };
    bot: {
      games: number;
      wins: number;
      losses: number;
      draws: number;
    };
  };
  
  // Streaks
  currentWinStreak: number;
  bestWinStreak: number;
  currentLossStreak: number;
  
  // Game preferences
  favoriteGridSize: number | null;
  totalPlayTime: number; // in minutes
  
  // Achievements
  achievements: string[];
  
  lastPlayed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const playerStatsSchema = new Schema<IPlayerStats>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// Indexes
playerStatsSchema.index({ user: 1 });
playerStatsSchema.index({ winRate: -1 });
playerStatsSchema.index({ wins: -1 });

// Virtual to calculate win rate
playerStatsSchema.pre('save', function (next) {
  if (this.totalGames > 0) {
    this.winRate = Number(((this.wins / this.totalGames) * 100).toFixed(2));
  } else {
    this.winRate = 0;
  }
  next();
});

const PlayerStats = mongoose.model<IPlayerStats>('PlayerStats', playerStatsSchema);

export default PlayerStats;