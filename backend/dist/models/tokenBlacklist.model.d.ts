import mongoose, { Document } from 'mongoose';
export interface ITokenBlacklist extends Document {
    token: string;
    expiresAt: Date;
}
declare const TokenBlacklist: mongoose.Model<ITokenBlacklist, {}, {}, {}, mongoose.Document<unknown, {}, ITokenBlacklist, {}, mongoose.DefaultSchemaOptions> & ITokenBlacklist & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITokenBlacklist>;
export default TokenBlacklist;
