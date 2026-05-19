const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface Room {
  id: string;
  roomNo: string;
  player1: string;
  player2: string | null;
  createdAt: string;
  status: "In Progress" | "In Lobby";
}

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

    return data.map((room: any) => ({
      id: room._id || room.id,
      roomNo: room.name || room._id?.slice(-6).toUpperCase(),
      player1: room.player1 || "Unknown",
      player2: room.player2 || null,
      createdAt: room.createdAt ? new Date(room.createdAt).toLocaleString() : "N/A",
      status: room.status === "In Progress" ? "In Progress" : "In Lobby",
    }));
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
