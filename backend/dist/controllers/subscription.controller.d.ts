import { Request, Response } from 'express';
declare class SubscriptionController {
    getAllSubscriptions(req: Request, res: Response): Promise<void>;
    getSubscriptionById(req: Request, res: Response): Promise<void>;
    getActiveSubscriptions(req: Request, res: Response): Promise<void>;
    createSubscription(req: Request, res: Response): Promise<void>;
    updateSubscription(req: Request, res: Response): Promise<void>;
    deleteSubscription(req: Request, res: Response): Promise<void>;
    toggleSubscriptionStatus(req: Request, res: Response): Promise<void>;
    subscribeUser(req: Request, res: Response): Promise<void>;
    unsubscribeUser(req: Request, res: Response): Promise<void>;
}
declare const _default: SubscriptionController;
export default _default;
