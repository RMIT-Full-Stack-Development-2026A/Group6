import { Request, Response } from 'express';
declare class AuthController {
    signup(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
}
declare const _default: AuthController;
export default _default;
