import { Request, Response, NextFunction } from 'express';
declare const premiumMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default premiumMiddleware;
