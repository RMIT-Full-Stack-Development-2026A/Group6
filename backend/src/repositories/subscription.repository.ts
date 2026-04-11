import Subscription, { ISubscription } from '../models/subscription.model';

export interface CreateSubscriptionData {
  name: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
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
  name?: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
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

class SubscriptionRepository {
  async findById(subscriptionId: string): Promise<ISubscription | null> {
    return await Subscription.findById(subscriptionId);
  }

  async findByName(name: string): Promise<ISubscription | null> {
    return await Subscription.findOne({ name });
  }

  async create(subscriptionData: CreateSubscriptionData): Promise<ISubscription> {
    const subscription = new Subscription(subscriptionData);
    return await subscription.save();
  }

  async update(
    subscriptionId: string,
    updateData: UpdateSubscriptionData
  ): Promise<ISubscription | null> {
    return await Subscription.findByIdAndUpdate(subscriptionId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(subscriptionId: string): Promise<ISubscription | null> {
    return await Subscription.findByIdAndDelete(subscriptionId);
  }

  async findAll(activeOnly: boolean = false): Promise<ISubscription[]> {
    const query = activeOnly ? { isActive: true } : {};
    return await Subscription.find(query).sort({ price: 1 });
  }

  async findActive(): Promise<ISubscription[]> {
    return await Subscription.find({ isActive: true }).sort({ price: 1 });
  }

  async toggleActive(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscription | null> {
    return await Subscription.findByIdAndUpdate(
      subscriptionId,
      { isActive },
      { new: true }
    );
  }
}

export default new SubscriptionRepository();