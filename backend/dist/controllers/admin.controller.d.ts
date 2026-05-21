import { Request, Response } from 'express';
declare class AdminController {
    getAllUsers(req: Request, res: Response): Promise<void>;
    getUserById(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    deactivateUser(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    reactivateUser(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
}
declare const _default: AdminController;
export default _default;
