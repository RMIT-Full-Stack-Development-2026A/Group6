import { Request, Response } from 'express';
import subscriptionService from '../services/subscription.service';

class SubscriptionController {
  /* Get all subscription plans */
  async getAllSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const activeOnly = req.query.active === 'true';
      const subscriptions = await subscriptionService.getAllSubscriptions(activeOnly);

      res.status(200).json({
        success: true,
        data: subscriptions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Get subscription plan by ID */
  async getSubscriptionById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const subscription = await subscriptionService.getSubscriptionById(id);

      res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Get active subscription plans (for users to browse) */
  async getActiveSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const subscriptions = await subscriptionService.getActiveSubscriptions();

      res.status(200).json({
        success: true,
        data: subscriptions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Create new subscription plan (Admin) */
  async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscriptionData = req.body;
      const subscription = await subscriptionService.createSubscription(subscriptionData);

      res.status(201).json({
        success: true,
        message: 'Subscription plan created successfully',
        data: subscription,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Update subscription plan (Admin) */
  async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const updateData = req.body;

      const subscription = await subscriptionService.updateSubscription(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Subscription plan updated successfully',
        data: subscription,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Delete subscription plan (Admin) */
  async deleteSubscription(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await subscriptionService.deleteSubscription(id);

      res.status(200).json({
        success: true,
        message: 'Subscription plan deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Toggle subscription status (Admin) */
  async toggleSubscriptionStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value',
        });
        return;
      }

      const subscription = await subscriptionService.toggleSubscriptionStatus(id, isActive);

      res.status(200).json({
        success: true,
        message: `Subscription plan ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: subscription,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Subscribe current user to a plan */
  async subscribeUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { subscriptionId } = req.body;

      if (!subscriptionId) {
        res.status(400).json({
          success: false,
          message: 'Subscription ID is required',
        });
        return;
      }

      const user = await subscriptionService.subscribeUser(userId, subscriptionId);

      res.status(200).json({
        success: true,
        message: 'Successfully subscribed to plan',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  /* Unsubscribe current user */
  async unsubscribeUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await subscriptionService.unsubscribeUser(userId);

      res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from plan',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}

export default new SubscriptionController();