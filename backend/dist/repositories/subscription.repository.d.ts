import { ISubscription } from '../models/subscription.model';
export interface CreateSubscriptionData {
    name: 'Free' | 'Premium';
    description: string;
    price: number;
    currency?: string;
    duration: {
        value: number;
        unit: 'day' | 'month' | 'year';
    };
    features?: Partial<ISubscription['features']>;
    benefits?: string[];
    isActive?: boolean;
    displayOrder?: number;
}
export interface UpdateSubscriptionData {
    name?: 'Free' | 'Premium';
    description?: string;
    price?: number;
    currency?: string;
    duration?: {
        value: number;
        unit: 'day' | 'month' | 'year';
    };
    features?: Partial<ISubscription['features']>;
    benefits?: string[];
    isActive?: boolean;
    displayOrder?: number;
}
declare class SubscriptionRepository {
    findById(subscriptionId: string): Promise<ISubscription | null>;
    findByName(name: 'Free' | 'Premium'): Promise<ISubscription | null>;
    create(subscriptionData: CreateSubscriptionData): Promise<ISubscription>;
    update(subscriptionId: string, updateData: UpdateSubscriptionData): Promise<ISubscription | null>;
    delete(subscriptionId: string): Promise<ISubscription | null>;
    findAll(activeOnly?: boolean): Promise<ISubscription[]>;
    findActive(): Promise<ISubscription[]>;
    toggleActive(subscriptionId: string, isActive: boolean): Promise<ISubscription | null>;
}
declare const _default: SubscriptionRepository;
export default _default;
