import { Request, Response } from 'express';
import adminService from '../services/admin.service';

class AdminController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getUserById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const user = await adminService.getUserById(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message });
    }
  }

  async deactivateUser(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const user = await adminService.deactivateUser(req.params.id);
      res.status(200).json({ success: true, message: 'User deactivated', data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  async reactivateUser(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const user = await adminService.reactivateUser(req.params.id);
      res.status(200).json({ success: true, message: 'User reactivated', data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }
}

export default new AdminController();