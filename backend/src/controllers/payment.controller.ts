import { Request, Response } from 'express';
import paymentService from '../services/payment.service';

class PaymentController {
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
