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
const moveSchema = new mongoose_1.Schema({
    player: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    position: {
        row: { type: Number, required: true },
        col: { type: Number, required: true },
        algebraic: { type: String, required: true },
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
}, { _id: false });
const gameSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        playerO: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        player2Name: {
            type: String,
            default: '',
        },
    },
    customization: {
        boardStyle: {
            type: String,
            enum: ['classic', 'mint', 'dark'],
            default: 'classic',
        },
        markerX: {
            type: String,
            default: 'X',
        },
        markerO: {
            type: String,
            default: 'O',
        },
    },
    aiDifficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: null,
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
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
        validate: {
            validator: function (v) {
                return (v === null ||
                    v === 'AI' ||
                    mongoose_1.default.Types.ObjectId.isValid(v));
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
}, {
    timestamps: true,
});
// Indexes
gameSchema.index({ status: 1 });
gameSchema.index({ gameMode: 1, status: 1 });
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
const Game = mongoose_1.default.model('Game', gameSchema);
exports.default = Game;
//# sourceMappingURL=game.model.js.map