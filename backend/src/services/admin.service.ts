import adminRepository from '../repositories/admin.repository';
import { IAdmin } from '../models/admin.model';

class AdminService {
  // Create admin with validation
  async createAdmin(adminData: Partial<IAdmin>): Promise<IAdmin> {
    try {
      // TODO: Add business logic and validation
      const admin = await adminRepository.create(adminData);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Get admin by ID
  async getAdminById(id: string): Promise<IAdmin> {
    try {
      // TODO: Add business logic
      const admin = await adminRepository.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Get admin by username
  async getAdminByUsername(username: string): Promise<IAdmin> {
    try {
      // TODO: Add business logic
      const admin = await adminRepository.findByUsername(username);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Get all admins
  async getAllAdmins(): Promise<IAdmin[]> {
    try {
      // TODO: Add business logic (filtering, pagination, etc.)
      const admins = await adminRepository.findAll();
      return admins;
    } catch (error) {
      throw error;
    }
  }

  // Update admin
  async updateAdmin(id: string, adminData: Partial<IAdmin>): Promise<IAdmin> {
    try {
      // TODO: Add business logic and validation
      const admin = await adminRepository.update(id, adminData);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Delete admin
  async deleteAdmin(id: string): Promise<IAdmin> {
    try {
      // TODO: Add business logic
      const admin = await adminRepository.delete(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // TODO: Add custom business logic methods
}

export default new AdminService();
