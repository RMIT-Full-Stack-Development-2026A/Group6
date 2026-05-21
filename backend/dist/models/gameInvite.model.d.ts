import mongoose, { Document } from 'mongoose';
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
export interface IGameInvite extends Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId | null;
    gameMode: 'online';
    gridSize: number;
    isRanked: boolean;
    isPublic: boolean;
    roomCode: string;
    status: InviteStatus;
    game: mongoose.Types.ObjectId | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const GameInvite: mongoose.Model<IGameInvite, {}, {}, {}, mongoose.Document<unknown, {}, IGameInvite, {}, mongoose.DefaultSchemaOptions> & IGameInvite & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IGameInvite>;
export default GameInvite;
