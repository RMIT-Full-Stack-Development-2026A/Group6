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
    theme?: 'light' | 'dark' | 'auto';
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

export async function getPlayerStats(userId?: string): Promise<any> {
  return {
    totalGames: 1284, 
    wins: 930,
    losses: 200,
    draws: 154,
    winRate: 72.4,
    currentWinStreak: 5,
    bestWinStreak: 14,
    totalPlayTime: 504,
    stats: {
      local: { games: 400, wins: 300, losses: 70, draws: 30 },
      online: { games: 700, wins: 530, losses: 110, draws: 60, ranking: 42 },
      bot: { games: 184, wins: 100, losses: 20, draws: 64 },
    },
  };
}

export async function getGameHistory(userId?: string, page = 1, limit = 10): Promise<any> {
  return {
    total: 1284,
    games: [
      { _id: "g1", gameMode: "online", roomCode: "#8821", players: { playerX: "Elias Jensen", playerO: "Tim Cook" }, result: "X", startedAt: new Date(), completedAt: new Date() },
      { _id: "g2", gameMode: "local", roomCode: "#8819", players: { playerX: "Elias Jensen", playerO: "Player 2" }, result: "O", startedAt: new Date(), completedAt: new Date() },
      { _id: "g3", gameMode: "bot", roomCode: "#8812", players: { playerX: "Elias Jensen", playerO: "Jeff (Bot)" }, result: "draw", startedAt: new Date(), completedAt: new Date() },
    ],
  };
}

export default { getProfile, getUserById, updateProfile, updatePassword, getSubscription, getPlayerStats, getGameHistory };