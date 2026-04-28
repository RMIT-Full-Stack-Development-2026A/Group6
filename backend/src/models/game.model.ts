import mongoose, { Document, Schema, CallbackWithoutResultAndOptionalError } from 'mongoose';

export type GameMode = 'local' | 'online' | 'bot';
export type GameStatus = 'waiting' | 'in-progress' | 'completed' | 'abandoned';
export type CellValue = 'X' | 'O' | null;

export interface IMove {
  player: mongoose.Types.ObjectId;
  position: {
    row: number;
    col: number;
  };
  symbol: 'X' | 'O';
  timestamp: Date;
}

export interface IGame extends Document {
  gameMode: GameMode;
  gridSize: number;
  players: {
    playerX: mongoose.Types.ObjectId | null;
    playerO: mongoose.Types.ObjectId | null;
  };
  currentTurn: 'X' | 'O';
  boardState: CellValue[][];
  status: GameStatus;
  winner: mongoose.Types.ObjectId | 'AI' | null;
  result: 'X' | 'O' | 'draw' | null;
  moves: IMove[];
  startedAt: Date | null;
  completedAt: Date | null;
  roomCode?: string;
  isRanked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const moveSchema = new Schema<IMove>(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    position: {
      row: { type: Number, required: true },
      col: { type: Number, required: true },
    },
    symbol: {
      type: String,
      enum: ['X', 'O'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const gameSchema = new Schema<IGame>(
  {
    gameMode: {
      type: String,
      enum: ['local', 'online', 'bot'],
      required: true,
    },
    gridSize: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 3,
    },
    players: {
      playerX: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      playerO: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    currentTurn: {
      type: String,
      enum: ['X', 'O'],
      default: 'X',
    },
    boardState: {
      type: [[String]],
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed', 'abandoned'],
      default: 'waiting',
    },
    winner: {
      type: Schema.Types.Mixed,
      default: null,
      validate: {
        validator: function (v: any) {
          return (
            v === null ||
            v === 'AI' ||
            mongoose.Types.ObjectId.isValid(v)
          );
        },
        message: 'Winner must be ObjectId, "AI", or null',
      },
    },

    result: {
      type: String,
      enum: ['X', 'O', 'draw', null],
      default: null,
    },

    moves: [moveSchema],

    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },

    roomCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    isRanked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
gameSchema.index({ status: 1 });
gameSchema.index({ gameMode: 1, status: 1 });
gameSchema.index({ roomCode: 1 });
gameSchema.index({ 'players.playerX': 1 });
gameSchema.index({ 'players.playerO': 1 });
gameSchema.index({ createdAt: -1 });

gameSchema.pre('save', async function () {
  if (this.isNew && (!this.boardState || !this.boardState.length)) {
    this.boardState = Array(this.gridSize)
      .fill(null)
      .map(() => Array(this.gridSize).fill(null));
  }
});

const Game = mongoose.model<IGame>('Game', gameSchema);
export default Game;