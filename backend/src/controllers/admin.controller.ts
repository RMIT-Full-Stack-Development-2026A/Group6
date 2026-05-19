import { Request, Response } from 'express';
import adminService from '../services/admin.service';

class AdminController {
  // Create admin
  async create(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Add input validation (express-validator)
      const adminData = req.body;
      const admin = await adminService.createAdmin(adminData);
      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: admin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Get admin by ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const admin = await adminService.getAdminById(id);
      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Get all admins
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Add pagination and filtering
      const admins = await adminService.getAllAdmins();
      res.status(200).json({
        success: true,
        data: admins,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Update admin
  async update(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Add input validation
      const id = String(req.params.id);
      const adminData = req.body;
      const admin = await adminService.updateAdmin(id, adminData);
      res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: admin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // Delete admin
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const admin = await adminService.deleteAdmin(id);
      res.status(200).json({
        success: true,
        message: 'Admin deleted successfully',
        data: admin,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  // TODO: Add custom controller methods
}

export default new AdminController();
