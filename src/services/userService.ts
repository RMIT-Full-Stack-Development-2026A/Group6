// export interface User {
//   _id: string;
//   username: string;
//   email: string;
//   role: 'user' | 'admin';
//   currentSubscription: string | null;
//   profile: {
//     avatar: string;
//     firstName: string;
//     lastName: string;
//     bio: string;
//     country: string;
//   };
//   preferences: {
//     notifications: boolean;
//     soundEffects: boolean;
//     theme: 'light' | 'dark' | 'auto';
//   };
//   isActive: boolean;
//   isEmailVerified: boolean;
//   lastLogin: Date | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface PlayerStats {
//   _id: string;
//   user: string;
//   totalGames: number;
//   wins: number;
//   losses: number;
//   draws: number;
//   winRate: number;
//   stats: {
//     local: {
//       games: number;
//       wins: number;
//       losses: number;
//       draws: number;
//     };
//     online: {
//       games: number;
//       wins: number;
//       losses: number;
//       draws: number;
//       ranking: number;
//     };
//     bot: {
//       games: number;
//       wins: number;
//       losses: number;
//       draws: number;
//     };
//   };
//   currentWinStreak: number;
//   bestWinStreak: number;
//   currentLossStreak: number;
//   favoriteGridSize: number | null;
//   totalPlayTime: number;
//   achievements: string[];
//   lastPlayed: Date | null;
// }

// export interface Game {
//   _id: string;
//   gameMode: 'local' | 'online' | 'bot';
//   gridSize: number;
//   players: {
//     playerX: string | null;
//     playerO: string | null;
//   };
//   currentTurn: 'X' | 'O';
//   status: 'waiting' | 'in-progress' | 'completed' | 'abandoned';
//   winner: string | null;
//   result: 'X' | 'O' | 'draw' | null;
//   startedAt: Date | null;
//   completedAt: Date | null;
//   roomCode?: string;
//   isRanked: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Subscription {
//   _id: string;
//   name: 'Free' | 'Premium';
//   description: string;
//   price: number;
//   currency: string;
//   duration: {
//     value: number;
//     unit: 'day' | 'month' | 'year';
//   };
//   features: {
//     maxGames: number | null;
//     multiplayerAccess: boolean;
//     premiumSupport: boolean;
//     adFree: boolean;
//     customThemes: boolean;
//     priorityAccess: boolean;
//     cloudSave: boolean;
//   };
//   benefits: string[];
//   isActive: boolean;
//   displayOrder: number;
// }

// export interface UpdateProfilePayload {
//   username?: string;
//   profile?: {
//     firstName?: string;
//     lastName?: string;
//     bio?: string;
//     country?: string;
//     avatar?: string;
//   };
//   preferences?: {
//     notifications?: boolean;
//     soundEffects?: boolean;
//     theme?: 'light' | 'dark' | 'auto';
//   };
// }

// export interface UpdatePasswordPayload {
//   oldPassword: string;
//   newPassword: string;
// }

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// // Get auth token from localStorage
// function getAuthToken(): string | null {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('authToken');
//   }
//   return null;
// }

// // Get current user profile
// export async function getProfile(): Promise<User> {
//   const token = getAuthToken();
//   const response = await fetch(`${API_BASE}/api/users/profile`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to fetch profile");
//   }

//   return data.data;
// }

// // Get user by ID (for viewing other players)
// export async function getUserById(userId: string): Promise<User> {
//   const token = getAuthToken();
//   const response = await fetch(`${API_BASE}/api/users/${userId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to fetch user");
//   }

//   return data.data;
// }

// // Update profile
// export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
//   const token = getAuthToken();
//   const response = await fetch(`${API_BASE}/api/users/profile`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to update profile");
//   }

//   return data.data;
// }

// // Update password
// export async function updatePassword(payload: UpdatePasswordPayload): Promise<void> {
//   const token = getAuthToken();
//   const response = await fetch(`${API_BASE}/api/users/password`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to update password");
//   }
// }

// // Get player stats
// export async function getPlayerStats(userId?: string): Promise<PlayerStats> {
//   const token = getAuthToken();
//   const endpoint = userId 
//     ? `${API_BASE}/api/stats/${userId}` 
//     : `${API_BASE}/api/stats/me`;
  
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to fetch player stats");
//   }

//   return data.data;
// }

// // Get game history
// export async function getGameHistory(userId?: string, page = 1, limit = 10): Promise<{ games: Game[], total: number }> {
//   const token = getAuthToken();
//   const endpoint = userId 
//     ? `${API_BASE}/api/games/user/${userId}?page=${page}&limit=${limit}` 
//     : `${API_BASE}/api/games/me?page=${page}&limit=${limit}`;
  
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to fetch game history");
//   }

//   return {
//     games: data.data,
//     total: data.pagination?.total || data.data.length,
//   };
// }

// // Get subscription info
// export async function getSubscription(subscriptionId: string): Promise<Subscription> {
//   const token = getAuthToken();
//   const response = await fetch(`${API_BASE}/api/subscriptions/${subscriptionId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || "Failed to fetch subscription");
//   }

//   return data.data;
// }

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

// ---- MOCK DATA ----
const mockUser: User = {
  _id: "user_001",
  username: "Elias Jensen",
  email: "elias.j@architect.design",
  role: "user",
  currentSubscription: "sub_001",
  profile: {
    avatar: "",
    firstName: "Elias",
    lastName: "Jensen",
    bio: "Passionate Tic Tac Toe strategist.",
    country: "Denmark",
  },
  preferences: {
    notifications: true,
    soundEffects: true,
    theme: "light",
  },
  isActive: true,
  isEmailVerified: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSubscription: Subscription = {
  _id: "sub_001",
  name: "Premium",
  description: "Full access to all features",
  price: 9.99,
  currency: "USD",
  duration: { value: 1, unit: "month" },
  features: {
    maxGames: null,
    multiplayerAccess: true,
    premiumSupport: true,
    adFree: true,
    customThemes: true,
    priorityAccess: true,
    cloudSave: true,
  },
  benefits: ["Unlimited games", "Priority support", "Custom themes"],
  isActive: true,
  displayOrder: 1,
};

// ---- MOCK FUNCTIONS (replace real API calls) ----
export async function getProfile(): Promise<User> {
  return mockUser;
}

export async function getUserById(userId: string): Promise<User> {
  return { ...mockUser, _id: userId, username: "Other Player" };
}

export async function updateProfile(payload: any): Promise<User> {
  return { ...mockUser, ...payload };
}

export async function updatePassword(payload: any): Promise<void> {
  console.log("Mock: password updated", payload);
}

export async function getSubscription(subscriptionId: string): Promise<Subscription> {
  return mockSubscription;
}

export async function getPlayerStats(userId?: string): Promise<any> {
  return {
    totalGames: 1284, wins: 930, losses: 200, draws: 154,
    winRate: 72.4, currentWinStreak: 5, bestWinStreak: 14,
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