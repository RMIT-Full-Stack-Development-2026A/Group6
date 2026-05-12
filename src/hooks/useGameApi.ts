import { useCallback, useState } from "react"
import { GameConfig, GameState } from "@/context/gameContext"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

interface UseGameApiReturn {
  loading: boolean
  error: string | null
  createGameSession: (config: GameConfig) => Promise<string | null>
  finalizeGame: (gameState: GameState) => Promise<void>
}

export function useGameApi(): UseGameApiReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createGameSession = useCallback(async (config: GameConfig): Promise<string | null> => {
    setLoading(true)
    setError(null)
    try {
      const body = {
        gameMode: config.mode,
        gridSize: config.gridSize,
        customization: {
          boardStyle: config.boardStyle,
          markerX: config.markerX,
          markerO: config.markerO,
        },
        ...(config.mode === "bot" && { aiDifficulty: config.aiDifficulty }),
        players: {
          player2Name: config.player2Name,
        },
      }

      const res = await fetch(`${API_BASE}/api/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      })

      if (!res.ok) return null

      const data = await res.json()
      return data?.data?._id ?? null
    } catch {
      setError("Failed to create game session")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const finalizeGame = useCallback(async (gameState: GameState): Promise<void> => {
    if (!gameState.gameId) return
    setLoading(true)
    setError(null)
    try {
      const { status, winner, moves } = gameState

      let result: string | null = null
      if (status === "completed") {
        if (winner === "draw") result = "draw"
        else if (winner === "X") result = "X"
        else if (winner === "O") result = "O"
      }

      await fetch(`${API_BASE}/api/games/${gameState.gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status,
          result,
          completedAt: gameState.completedAt,
          moves: moves.map((m) => ({
            position: { row: m.row, col: m.col, algebraic: m.algebraic },
            symbol: m.symbol,
          })),
        }),
      })
    } catch {
      setError("Failed to save game result")
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, createGameSession, finalizeGame }
}