import { CreateSubscriptionData, UpdateSubscriptionData } from '../repositories/subscription.repository';
import { ISubscription } from '../models/subscription.model';
import { IUser } from '../models/user.model';
declare class SubscriptionService {
    getSubscriptionById(subscriptionId: string): Promise<ISubscription>;
    getAllSubscriptions(activeOnly?: boolean): Promise<ISubscription[]>;
    getActiveSubscriptions(): Promise<ISubscription[]>;
    createSubscription(subscriptionData: CreateSubscriptionData): Promise<ISubscription>;
    updateSubscription(subscriptionId: string, updateData: UpdateSubscriptionData): Promise<ISubscription>;
    deleteSubscription(subscriptionId: string): Promise<ISubscription>;
    toggleSubscriptionStatus(subscriptionId: string, isActive: boolean): Promise<ISubscription>;
    subscribeUser(userId: string, subscriptionId: string): Promise<IUser>;
    unsubscribeUser(userId: string): Promise<IUser>;
}
declare const _default: SubscriptionService;
export default _default;
