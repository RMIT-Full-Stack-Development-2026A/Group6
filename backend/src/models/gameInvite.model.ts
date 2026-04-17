import mongoose, { Document, Schema, CallbackWithoutResultAndOptionalError } from 'mongoose';

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';

export interface IGameInvite extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId | null; // null for public invites
  gameMode: 'online';
  gridSize: number;
  isRanked: boolean;
  isPublic: boolean; // Public invites anyone can join
  roomCode: string;
  status: InviteStatus;
  game: mongoose.Types.ObjectId | null; // Reference to created game
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const gameInviteSchema = new Schema<IGameInvite>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    gameMode: {
      type: String,
      enum: ['online'],
      default: 'online',
    },
    gridSize: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 3,
    },
    isRanked: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired', 'cancelled'],
      default: 'pending',
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for queries
gameInviteSchema.index({ sender: 1, status: 1 });
gameInviteSchema.index({ recipient: 1, status: 1 });
gameInviteSchema.index({ status: 1, isPublic: 1 });
gameInviteSchema.index({ expiresAt: 1 });

// Auto-expire invites
gameInviteSchema.pre('save', async function () {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  }
});

const GameInvite = mongoose.model<IGameInvite>('GameInvite', gameInviteSchema);

export default GameInvite;