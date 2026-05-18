import Subscription, { ISubscription } from '../models/subscription.model';

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

class SubscriptionRepository {
  // Retrieve a subscription plan by its MongoDB `_id`.
  async findById(subscriptionId: string): Promise<ISubscription | null> {
    return await Subscription.findById(subscriptionId);
  }

  // Find a plan by its display name, such as Free or Premium.
  async findByName(name: string): Promise<ISubscription | null> {
    return await Subscription.findOne({ name });
  }

  // Create a new subscription plan document.
  async create(subscriptionData: CreateSubscriptionData): Promise<ISubscription> {
    const subscription = new Subscription(subscriptionData);
    return await subscription.save();
  }

  // Perform an update on the subscription plan record.
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

  // Return all plans, optionally limiting to active ones only.
  async findAll(activeOnly: boolean = false): Promise<ISubscription[]> {
    const query = activeOnly ? { isActive: true } : {};
    return await Subscription.find(query).sort({ price: 1 });
  }

  // Return only currently active plans for frontend selection.
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