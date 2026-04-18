export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  currentSubscription: string | null;
  profile: {
    avatar: string;
    firstName: string;
    lastName: string;
    bio: string;
    country: string;
  };
  preferences: {
    notifications: boolean;
    soundEffects: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStats {
  _id: string;
  user: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  stats: {
    local: {
      games: number;
      wins: number;
      losses: number;
      draws: number;
    };
    online: {
      games: number;
      wins: number;
      losses: number;
      draws: number;
      ranking: number;
    };
    bot: {
      games: number;
      wins: number;
      losses: number;
      draws: number;
    };
  };
  currentWinStreak: number;
  bestWinStreak: number;
  currentLossStreak: number;
  favoriteGridSize: number | null;
  totalPlayTime: number;
  achievements: string[];
  lastPlayed: Date | null;
}

export interface Game {
  _id: string;
  gameMode: 'local' | 'online' | 'bot';
  gridSize: number;
  players: {
    playerX: string | null;
    playerO: string | null;
  };
  currentTurn: 'X' | 'O';
  status: 'waiting' | 'in-progress' | 'completed' | 'abandoned';
  winner: string | null;
  result: 'X' | 'O' | 'draw' | null;
  startedAt: Date | null;
  completedAt: Date | null;
  roomCode?: string;
  isRanked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  _id: string;
  name: 'Free' | 'Premium';
  description: string;
  price: number;
  currency: string;
  duration: {
    value: number;
    unit: 'day' | 'month' | 'year';
  };
  features: {
    maxGames: number | null;
    multiplayerAccess: boolean;
    premiumSupport: boolean;
    adFree: boolean;
    customThemes: boolean;
    priorityAccess: boolean;
    cloudSave: boolean;
  };
  benefits: string[];
  isActive: boolean;
  displayOrder: number;
}

export interface UpdateProfilePayload {
  username?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    country?: string;
    avatar?: string;
  };
  preferences?: {
    notifications?: boolean;
    soundEffects?: boolean;
    theme?: 'light' | 'dark' | 'auto';
  };
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// Get current user profile
export async function getProfile(): Promise<User> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/api/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch profile");
  }

  return data.data;
}

// Get user by ID (for viewing other players)
export async function getUserById(userId: string): Promise<User> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch user");
  }

  return data.data;
}

// Update profile
export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/api/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update profile");
  }

  return data.data;
}

// Update password
export async function updatePassword(payload: UpdatePasswordPayload): Promise<void> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/api/users/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update password");
  }
}

// Get player stats
export async function getPlayerStats(userId?: string): Promise<PlayerStats> {
  const token = getAuthToken();
  const endpoint = userId 
    ? `${API_BASE}/api/stats/${userId}` 
    : `${API_BASE}/api/stats/me`;
  
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch player stats");
  }

  return data.data;
}

// Get game history
export async function getGameHistory(userId?: string, page = 1, limit = 10): Promise<{ games: Game[], total: number }> {
  const token = getAuthToken();
  const endpoint = userId 
    ? `${API_BASE}/api/games/user/${userId}?page=${page}&limit=${limit}` 
    : `${API_BASE}/api/games/me?page=${page}&limit=${limit}`;
  
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch game history");
  }

  return {
    games: data.data,
    total: data.pagination?.total || data.data.length,
  };
}

// Get subscription info
export async function getSubscription(subscriptionId: string): Promise<Subscription> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/api/subscriptions/${subscriptionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch subscription");
  }

  return data.data;
}

export default {
  getProfile,
  getUserById,
  updateProfile,
  updatePassword,
  getPlayerStats,
  getGameHistory,
  getSubscription,
};