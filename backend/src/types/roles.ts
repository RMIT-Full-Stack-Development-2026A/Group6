export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Permission {
  // Game permissions
  CREATE_GAME = 'create_game',
  READ_GAME = 'read_game',
  UPDATE_GAME = 'update_game',
  DELETE_GAME = 'delete_game',
  
  // Admin permissions
  CREATE_ADMIN = 'create_admin',
  READ_ADMIN = 'read_admin',
  UPDATE_ADMIN = 'update_admin',
  DELETE_ADMIN = 'delete_admin',
  
  // User management
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  
  // Game room management
  CREATE_GAME_ROOM = 'create_game_room',
  CLOSE_GAME_ROOM = 'close_game_room',
  
  // TODO: Add in future
  // VIEW_GAME_SESSIONS = 'view_game_sessions',
  // REPLAY_GAME = 'replay_game',
}

export type UserRoleType = keyof typeof UserRole;
