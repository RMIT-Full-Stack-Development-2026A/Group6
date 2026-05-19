const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

async function requestJson<T>(input: RequestInfo, init: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  let data: any;

  try {
    data = await response.json();
  } catch (jsonError) {
    const text = await response.text();
    throw new Error(text || 'Request failed with non-JSON response');
  }
 
  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }
  return data.data;
}

export async function getProfile(): Promise<User> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  return requestJson<User>(`${API_BASE}/api/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserById(userId: string): Promise<User> {
  // Backend route for user lookup is admin-only, so this fallback mock data has been commented out.
  // return {
  //   _id: userId,
  //   username: 'Other Player',
  //   email: 'player@example.com',
  //   role: 'user',
  //   currentSubscription: null,
  //   profile: {
  //     avatar: '',
  //     firstName: 'Other',
  //     lastName: 'Player',
  //     bio: 'This is another player.',
  //     country: 'Unknown',
  //   },
  //   preferences: {
  //     notifications: true,
  //     soundEffects: true,
  //     theme: 'light',
  //   },
  //   isActive: true,
  //   isEmailVerified: true,
  //   lastLogin: new Date(),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // };

  throw new Error('Admin-only user lookup is unavailable in the current environment.');
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  return requestJson<User>(`${API_BASE}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
 
export async function updatePassword(payload: UpdatePasswordPayload): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  await requestJson<void>(`${API_BASE}/api/users/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function getSubscription(subscriptionId: string): Promise<Subscription> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  return requestJson<Subscription>(`${API_BASE}/api/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
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
    theme?: 'classic' | 'mint' | 'dark';
  };
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// export default {
//   getProfile,
//   getUserById,
//   updateProfile,
//   updatePassword,
//   getPlayerStats,
//   getGameHistory,
//   getSubscription,
// };


//mock data for now
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  subscription: boolean;
  subscriptionExpires: Date | null;
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
    theme: 'classic' | 'mint' | 'dark';
  };
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  _id: string;
  name: 'Free' | 'Premium';
  description: string;
  price: number;
  currency: string;
  duration: { value: number; unit: 'day' | 'month' | 'year' };
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

export interface Game {
  _id: string;
  gameMode: 'local' | 'online' | 'bot';
  gridSize: number;
  players: {
    playerX: { _id: string; username: string } | null;
    playerO: { _id: string; username: string } | null;
    player2Name?: string;
  };
  aiDifficulty?: 'easy' | 'medium' | 'hard';
  result: 'X' | 'O' | 'draw' | null;
  status: 'waiting' | 'in-progress' | 'completed' | 'abandoned';
  roomCode?: string;
  startedAt: Date | string | null;
  completedAt: Date | string | null;
  createdAt: Date | string;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentWinStreak: number;
  bestWinStreak: number;
  currentLossStreak: number;
  totalPlayTime: number;
  favoriteGridSize: number | null;
  stats: {
    local: { games: number; wins: number; losses: number; draws: number };
    online: { games: number; wins: number; losses: number; draws: number; ranking: number };
    bot: { games: number; wins: number; losses: number; draws: number };
  };
}

export async function getPlayerStats(userId?: string): Promise<PlayerStats | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const data = await requestJson<PlayerStats | null>(`${API_BASE}/api/games/my/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    return data;
  } catch {
    return null;
  }
}

export async function getGameHistory(userId?: string, page = 1, limit = 10): Promise<{ total: number; games: Game[] }> {
  const token = getAuthToken();
  if (!token) return { total: 0, games: [] };
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const res = await fetch(`${API_BASE}/api/games/my?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed');
    return { total: data.total ?? 0, games: data.data ?? [] };
  } catch {
    return { total: 0, games: [] };
  }
}

export default { getProfile, getUserById, updateProfile, updatePassword, getSubscription, getPlayerStats, getGameHistory };