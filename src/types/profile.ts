// Re-export types from userService for convenience
export type {
  User,
  PlayerStats,
  Game,
  Subscription,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from '@/services/userService';

// Additional component-specific types
export type ActiveSection = 'profile' | 'history' | 'security' | 'subscription';

export type GameMode = 'local' | 'online' | 'bot';
export type GameStatus = 'waiting' | 'in-progress' | 'completed' | 'abandoned';
export type GameResult = 'X' | 'O' | 'draw' | null;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
}