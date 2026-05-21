const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
}

export interface PlayerReference {
  _id?: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface Room {
  id: string;
  roomNo: string;
  player1: string;
  player2: string | null;
  opponent: string;
  createdAt: string;
  status: string;
  gameMode?: string;
  aiDifficulty?: string;
}

const normalizePlayerReference = (player: any): string | null => {
  if (!player) return null;
  if (typeof player === "string") return player;
  if (typeof player !== "object") return String(player);

  if (player.username) return player.username;
  if (player.name) return player.name;
  const fullName = [player.firstName, player.lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;
  if (player._id) return player._id;
  return null;
};

/**
 * Fetch user by ID from the backend
 */
async function fetchUserById(userId: string): Promise<{ username: string } | null> {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result?.data || null;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
}

/**
 * Build a user ID to username map by fetching users from the backend
 */
async function getUsernameMap(): Promise<Map<string, string>> {
  const usernameMap = new Map<string, string>();
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/users?limit=1000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return usernameMap;

    const result = await response.json();
    const users = result?.data || [];

    users.forEach((user: any) => {
      const userId = user._id || user.id;
      const username = user.username;
      if (userId && username) {
        usernameMap.set(userId, username);
      }
    });
  } catch (error) {
    console.error("Error fetching users for username map:", error);
  }

  return usernameMap;
}

/**
 * Fetch all active game rooms
 * API Endpoint: GET /api/games
 */
export async function getRooms(): Promise<Room[]> {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/games`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.statusText}`);
    }

    const result = await response.json();
    const data = result?.data || [];

    // Fetch username map for player ID lookup
    const usernameMap = await getUsernameMap();

    return data.map((room: any) => {
      // Extract player IDs from the players object structure
      // Handle: players.playerX (ObjectId), players.player0 (null or ObjectId), etc.
      const playerX = room.players?.playerX;
      const player0 = room.players?.player0;

      // Convert ObjectId to string if needed
      const player1Id = playerX ? String(playerX) : null;
      const player2Id = player0 ? String(player0) : null;

      // Look up usernames from the map
      let player1Label = "Unknown";
      if (player1Id) {
        player1Label = usernameMap.get(player1Id) || player1Id;
      }

      let player2Label: string | null = null;
      if (player2Id) {
        player2Label = usernameMap.get(player2Id) || player2Id;
      }

      const gameMode = room.gameMode || room.matchType || room.type || "Standard";
      const opponentLabel = gameMode === "bot" ? (room.players?.player2Name || "Bot") : (player2Label || "Unknown");

      return {
        id: room._id || room.id,
        roomNo: room.name || room._id?.slice(-6).toUpperCase(),
        player1: player1Label,
        player2: player2Label,
        opponent: opponentLabel,
        createdAt: room.createdAt ? new Date(room.createdAt).toLocaleString() : "N/A",
        status: room.status || "",
        gameMode,
        aiDifficulty: room.customization?.aiDifficulty || room.aiDifficulty || room.difficulty || undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
}

/**
 * Create a new game room
 * API Endpoint: POST /api/rooms
 */
export async function createRoom() {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/rooms`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to create room: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error creating room:", error);
  //   throw error;
  // }
  console.log("Creating new room");
}

/**
 * Filter rooms by criteria
 * API Endpoint: POST /api/rooms/filter
 */
export async function filterRooms(criteria: Record<string, any>) {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/rooms/filter`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(criteria),
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to filter rooms: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error filtering rooms:", error);
  //   throw error;
  // }
  console.log("Filtering rooms with criteria:", criteria);
}

/**
 * Close/end a game room
 * API Endpoint: PUT /api/rooms/:id/close
 */
export async function closeRoom(roomId: string) {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/close`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to close room: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error closing room:", error);
  //   throw error;
  // }
  console.log("Closing room:", roomId);
}

/**
 * Spectate a game room
 * API Endpoint: POST /api/rooms/:id/spectate
 */
export async function spectateRoom(roomId: string) {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/spectate`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to spectate room: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error spectating room:", error);
  //   throw error;
  // }
  console.log("Spectating room:", roomId);
}
