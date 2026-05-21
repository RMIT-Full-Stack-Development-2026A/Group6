const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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
 * Fetch all active game rooms
 * API Endpoint: GET /api/games
 */
export async function getRooms(): Promise<Room[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/games`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.statusText}`);
    }

    const result = await response.json();
    const data = result?.data || [];

    return data.map((room: any) => {
      const player1Value = room.player1 || room.player?.player1 || null;
      const player2Value = room.player2 || room.player?.player2 || null;
      const player1Label = normalizePlayerReference(player1Value) || "Unknown";
      const player2Label = normalizePlayerReference(player2Value) || null;
      const gameMode = room.gameMode || room.matchType || room.type || "Standard";
      const opponentLabel = gameMode === "bot" ? "Bot" : player2Label || "Unknown";

      return {
        id: room._id || room.id,
        roomNo: room.name || room._id?.slice(-6).toUpperCase(),
        player1: player1Label,
        player2: player2Label,
        opponent: opponentLabel,
        createdAt: room.createdAt ? new Date(room.createdAt).toLocaleString() : "N/A",
        status: room.status || "",
        gameMode,
        aiDifficulty: room.aiDifficulty || room.difficulty || undefined,
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
