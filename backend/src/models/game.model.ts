import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  name: string;
  // TODO: Add more fields based on finalized data model UML
  createdAt?: Date;
  updatedAt?: Date;
}

const gameSchema: Schema<IGame> = new Schema(
  {
    // Add fields based on finalized data model UML
    name: {
      type: String,
      required: true,
    },
    // TODO: Add more fields as per UML specification
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGame>('Game', gameSchema);
