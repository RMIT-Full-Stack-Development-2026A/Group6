import { Request, Response } from 'express';
import paymentService from '../services/payment.service';

class PaymentController {

  // Processes a Pro upgrade payment for the logged-in user
  async upgradeToProSuccess(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { paymentMethod } = req.body;

      if (!paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Payment method is required',
        });
        return;
      }

      // Subscription cost is fixed at $10 per month
      const result = await paymentService.processPayment({
        userId,
        paymentMethod,
        amount: 10,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  // Cancels the active subscription for the logged-in user
  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await paymentService.cancelSubscription(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}

export default new PaymentController();