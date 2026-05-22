export interface GameStatePayload {
  playerMoves: string[]
  botMoves: string[]
  last_move: string
}

export interface GameResponse {
  success: boolean
  message?: string
  data?: any
}
 
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export async function saveGameState(payload: GameStatePayload): Promise<GameResponse> {
  const response = await fetch(`${API_BASE}/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
 
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "Failed to save game state")
  }

  return data
}

export default {
  saveGameState,
}
