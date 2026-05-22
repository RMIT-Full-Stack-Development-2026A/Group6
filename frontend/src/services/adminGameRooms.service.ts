const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
 * API Endpoint: GET /api/rooms
 */
export async function getRooms(): Promise<Room[]> {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/rooms`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch rooms: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error fetching rooms:", error);
  //   return [];
  // }
  return [];
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
