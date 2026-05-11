import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  name?: string;
  playerMoves: string[];
  botMoves: string[];
  last_move: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const gameSchema: Schema<IGame> = new Schema(
  {
    name: {
      type: String,
      default: 'Playfield game',
    },
    playerMoves: {
      type: [String],
      default: [],
    },
    botMoves: {
      type: [String],
      default: [],
    },
    last_move: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGame>('Game', gameSchema);
