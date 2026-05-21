import { Request, Response } from 'express';
declare class PaymentController {
    upgradeToProSuccess(req: Request, res: Response): Promise<void>;
    cancelSubscription(req: Request, res: Response): Promise<void>;
}
declare const _default: PaymentController;
export default _default;
