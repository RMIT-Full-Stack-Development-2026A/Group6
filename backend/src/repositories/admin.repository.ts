import Admin, { IAdmin } from '../models/admin.model';

class AdminRepository {
  // Create a new admin
  async create(adminData: Partial<IAdmin>): Promise<IAdmin> {
    try {
      const admin = await Admin.create(adminData);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Find admin by ID
  async findById(id: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findById(id);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Find admin by username
  async findByUsername(username: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findOne({ username });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Find all admins
  async findAll(): Promise<IAdmin[]> {
    try {
      const admins = await Admin.find();
      return admins;
    } catch (error) {
      throw error;
    }
  }

  // Update admin by ID
  async update(id: string, adminData: Partial<IAdmin>): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findByIdAndUpdate(id, adminData, { new: true });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Delete admin by ID
  async delete(id: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findByIdAndDelete(id);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // TODO: Add custom queries as per requirements
}

export default new AdminRepository();
