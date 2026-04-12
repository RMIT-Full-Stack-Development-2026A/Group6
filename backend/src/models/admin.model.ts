import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  // TODO: Add more fields based on finalized data model UML
  createdAt?: Date;
  updatedAt?: Date;
}

const adminSchema: Schema<IAdmin> = new Schema(
  {
    // Add fields based on finalized data model UML
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // TODO: Add more fields as per UML specification
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAdmin>('Admin', adminSchema);
