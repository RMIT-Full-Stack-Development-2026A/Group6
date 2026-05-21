import mongoose, { Document } from 'mongoose';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export interface IUserSubscription extends Document {
    user: mongoose.Types.ObjectId;
    subscription: mongoose.Types.ObjectId;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    paymentMethod?: string;
    transactionId?: string;
    cancelledAt?: Date | null;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const UserSubscription: mongoose.Model<IUserSubscription, {}, {}, {}, mongoose.Document<unknown, {}, IUserSubscription, {}, mongoose.DefaultSchemaOptions> & IUserSubscription & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserSubscription>;
export default UserSubscription;
