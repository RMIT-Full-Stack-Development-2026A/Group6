import mongoose, { Document } from 'mongoose';
export interface ISubscriptionFeatures {
    maxGames: number | null;
    multiplayerAccess: boolean;
    premiumSupport: boolean;
    adFree: boolean;
    customThemes: boolean;
    priorityAccess: boolean;
    cloudSave: boolean;
}
export interface ISubscription extends Document {
    name: 'Free' | 'Premium';
    description: string;
    price: number;
    currency: string;
    duration: {
        value: number;
        unit: 'day' | 'month' | 'year';
    };
    features: ISubscriptionFeatures;
    benefits: string[];
    isActive: boolean;
    displayOrder: number;
    pricePerDay: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Subscription: mongoose.Model<ISubscription, {}, {}, {}, mongoose.Document<unknown, {}, ISubscription, {}, mongoose.DefaultSchemaOptions> & ISubscription & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubscription>;
export default Subscription;
