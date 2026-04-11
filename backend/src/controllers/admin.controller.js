const adminService = require('../services/admin.service');

class AdminController {
  // Create admin
  async create(req, res) {
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
        message: error.message,
      });
    }
  }

  // Get admin by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const admin = await adminService.getAdminById(id);
      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all admins
  async getAll(req, res) {
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
        message: error.message,
      });
    }
  }

  // Update admin
  async update(req, res) {
    try {
      // TODO: Add input validation
      const { id } = req.params;
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
        message: error.message,
      });
    }
  }

  // Delete admin
  async delete(req, res) {
    try {
      const { id } = req.params;
      const admin = await adminService.deleteAdmin(id);
      res.status(200).json({
        success: true,
        message: 'Admin deleted successfully',
        data: admin,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // TODO: Add custom controller methods
}

module.exports = new AdminController();
