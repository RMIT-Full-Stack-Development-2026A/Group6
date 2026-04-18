import { Permission, UserRole } from '../types/roles';

class RBACService {
  
  // Role mapping to permissions
  private rolePermissions: Record<string, Permission[]> = {
    [UserRole.ADMIN]: [
      // Game permissions
      Permission.CREATE_GAME,
      Permission.READ_GAME,
      Permission.UPDATE_GAME,
      Permission.DELETE_GAME,
      
      // Admin permissions
      Permission.CREATE_ADMIN,
      Permission.READ_ADMIN,
      Permission.UPDATE_ADMIN,
      Permission.DELETE_ADMIN,
      
      // User management
      Permission.VIEW_USERS,
      Permission.MANAGE_USERS,
      
      // Game room management
      Permission.CREATE_GAME_ROOM,
      Permission.CLOSE_GAME_ROOM,
    ],
    
    [UserRole.USER]: [
      // Game permissions
      Permission.CREATE_GAME,
      Permission.READ_GAME,
      Permission.UPDATE_GAME,
      
      // Game room management
      Permission.CREATE_GAME_ROOM,
      Permission.CLOSE_GAME_ROOM,
    ],
  };

  /**
   * Check if a user has a specific permission
   * @param role User role
   * @param permission Required permission
   * @returns true if user has permission, false otherwise
   */
  hasPermission(role: string, permission: Permission): boolean {
    const permissions = this.rolePermissions[role];
    
    if (!permissions) {
      return false;
    }
    
    return permissions.includes(permission);
  }

  /**
   * Check if user has any of the required permissions
   * @param role User role
   * @param permissions Array of permissions (OR logic)
   * @returns true if user has at least one permission
   */
  hasAnyPermission(role: string, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(role, permission));
  }

  /**
   * Check if user has all required permissions
   * @param role User role
   * @param permissions Array of permissions (AND logic)
   * @returns true if user has all permissions
   */
  hasAllPermissions(role: string, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(role, permission));
  }

  /**
   * Get all permissions for a role
   * @param role User role
   * @returns Array of permissions
   */
  getPermissions(role: string): Permission[] {
    return this.rolePermissions[role] || [];
  }

  /**
   * Check if role exists in system
   * @param role User role
   * @returns true if role exists
   */
  isValidRole(role: string): boolean {
    return role in this.rolePermissions;
  }

  /**
   * Get all available roles
   * @returns Array of role names
   */
  getAllRoles(): string[] {
    return Object.keys(this.rolePermissions);
  }

  // TODO: Add custom permission check methods as per requirements
}

export default new RBACService();
