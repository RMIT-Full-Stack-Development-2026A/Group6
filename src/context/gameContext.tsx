"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

export type CellValue = "X" | "O" | null
export type GameStatus = "idle" | "in-progress" | "completed" | "abandoned"
export type GameMode = "local" | "bot" | "online"
export type BoardStyle = "classic" | "mint" | "dark"

export interface GameConfig {
  mode: GameMode
  gridSize: number
  boardStyle: BoardStyle
  markerX: string
  markerO: string
  player1Name: string
  player2Name: string
  firstTurn: "X" | "O"
  aiDifficulty?: "easy" | "medium" | "hard"
}

export interface GameState {
  config: GameConfig
  board: CellValue[][]
  currentTurn: "X" | "O"
  status: GameStatus
  winner: "X" | "O" | "draw" | null
  winningCells: [number, number][]
  moves: { row: number; col: number; symbol: "X" | "O"; algebraic: string }[]
  startedAt: Date | null
  completedAt: Date | null
  gameId: string | null
}

const DEFAULT_CONFIG: GameConfig = {
  mode: "local",
  gridSize: 10,
  boardStyle: "classic",
  markerX: "X",
  markerO: "O",
  player1Name: "Player 1",
  player2Name: "Player 2",
  firstTurn: "X",
}

function makeEmptyBoard(size: number): CellValue[][] {
  return Array.from({ length: size }, () => Array(size).fill(null))
}

interface GameContextValue {
  gameState: GameState
  initGame: (config: GameConfig) => void
  placeMove: (row: number, col: number) => void
  abortGame: () => void
  resetGame: () => void
  setGameId: (id: string) => void
}

const GameContext = createContext<GameContextValue | null>(null)

function colToAlpha(col: number): string {
  let result = ""
  let n = col
  do {
    result = String.fromCharCode(97 + (n % 26)) + result
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return result
}

function toAlgebraic(row: number, col: number, gridSize: number): string {
  return `${colToAlpha(col)}${gridSize - row}`
}

function toBotNotation(row: number, col: number): string {
  return String.fromCharCode(65 + col) + (row + 1)
}

function fromBotNotation(notation: string): { row: number; col: number } {
  const col = notation.charCodeAt(0) - 65
  const row = parseInt(notation.slice(1), 10) - 1
  return { row, col }
}

function checkWin(
  board: CellValue[][],
  row: number,
  col: number,
  symbol: CellValue,
  gridSize: number
): [number, number][] | null {
  const directions: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (const [dr, dc] of directions) {
    const cells: [number, number][] = [[row, col]]
    for (let s = 1; s < 5; s++) {
      const r = row + dr * s, c = col + dc * s
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c] === symbol) cells.push([r, c])
      else break
    }
    for (let s = 1; s < 5; s++) {
      const r = row - dr * s, c = col - dc * s
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c] === symbol) cells.push([r, c])
      else break
    }
    if (cells.length >= 5) return cells.slice(0, 5)
  }
  return null
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function apiCreateGame(config: GameConfig): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/games`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        gameMode: config.mode,
        gridSize: config.gridSize,
        customization: {
          boardStyle: config.boardStyle,
          markerX: config.markerX,
          markerO: config.markerO,
        },
        players: { player2Name: config.player2Name },
        ...(config.mode === "bot" && { aiDifficulty: config.aiDifficulty ?? "easy" }),
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.data?._id ?? null
  } catch {
    return null
  }
}

async function apiSaveBotGame(
  gameId: string,
  playerMoves: { notation: string; row: number; col: number }[],
  botMoves: { notation: string; row: number; col: number }[],
  lastMove: string,
  outcome: "player" | "bot" | "draw" | "abandoned"
): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/games/${gameId}/bot-moves`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ playerMoves, botMoves, last_move: lastMove, outcome }),
    })
  } catch {

  }
}

async function apiSaveLocalGame(gameState: GameState): Promise<void> {
  if (!gameState.gameId) return
  try {
    const result =
      gameState.status !== "completed" ? null
      : gameState.winner === "draw"   ? "draw"
      : gameState.winner

    await fetch(`${API_BASE}/api/games/${gameState.gameId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: gameState.status,
        result,
        completedAt: gameState.completedAt,
        moves: gameState.moves.map((m) => ({
          position: { row: m.row, col: m.col, algebraic: m.algebraic },
          symbol: m.symbol,
        })),
      }),
    })
  } catch {

  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    config: DEFAULT_CONFIG,
    board: makeEmptyBoard(DEFAULT_CONFIG.gridSize),
    currentTurn: DEFAULT_CONFIG.firstTurn,
    status: "idle",
    winner: null,
    winningCells: [],
    moves: [],
    startedAt: null,
    completedAt: null,
    gameId: null,
  })

  const playerMovesRef = useRef<{ notation: string; row: number; col: number }[]>([])
  const botMovesRef    = useRef<{ notation: string; row: number; col: number }[]>([])
  const lastMoveRef    = useRef<string>("")

  const initGame = useCallback(async (config: GameConfig) => {
    playerMovesRef.current = []
    botMovesRef.current    = []
    lastMoveRef.current    = ""

    const gameId = await apiCreateGame(config)

    setGameState({
      config,
      board: makeEmptyBoard(config.gridSize),
      currentTurn: config.firstTurn,
      status: "in-progress",
      winner: null,
      winningCells: [],
      moves: [],
      startedAt: new Date(),
      completedAt: null,
      gameId,
    })
  }, [])

  const placeMove = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.status !== "in-progress") return prev
      if (prev.board[row][col] !== null) return prev

      const { gridSize, mode } = prev.config
      const symbol = prev.currentTurn
      const newBoard = prev.board.map((r) => [...r])
      newBoard[row][col] = symbol

      const algebraic = toAlgebraic(row, col, gridSize)
      const newMoves  = [...prev.moves, { row, col, symbol, algebraic }]
      lastMoveRef.current = algebraic

      if (mode === "bot") {
        const entry = { notation: algebraic, row, col }
        if (symbol === "X") {
          playerMovesRef.current = [...playerMovesRef.current, entry]
        } else {
          botMovesRef.current = [...botMovesRef.current, entry]
        }
      }

      const winCells = checkWin(newBoard, row, col, symbol, gridSize)
      if (winCells) {
        return {
          ...prev,
          board: newBoard,
          moves: newMoves,
          status: "completed",
          winner: symbol,
          winningCells: winCells,
          completedAt: new Date(),
        }
      }

      const isFull = newBoard.every((r) => r.every((c) => c !== null))
      if (isFull) {
        return {
          ...prev,
          board: newBoard,
          moves: newMoves,
          status: "completed",
          winner: "draw",
          winningCells: [],
          completedAt: new Date(),
        }
      }

      return {
        ...prev,
        board: newBoard,
        moves: newMoves,
        currentTurn: symbol === "X" ? "O" : "X",
      }
    })
  }, [])

  const abortGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, status: "abandoned", completedAt: new Date() }))
  }, [])

const resetGame = useCallback(async () => {
  playerMovesRef.current = []
  botMovesRef.current    = []
  lastMoveRef.current    = ""

  setGameState((prev) => {
    apiCreateGame(prev.config).then((newId) => {
      setGameState((curr) => ({ ...curr, gameId: newId }))
    })
    return {
      ...prev,
      board: makeEmptyBoard(prev.config.gridSize),
      currentTurn: prev.config.firstTurn,
      status: "in-progress",
      winner: null,
      winningCells: [],
      moves: [],
      startedAt: new Date(),
      completedAt: null,
      gameId: null,
    }
  })
}, [])

  const setGameId = useCallback((id: string) => {
    setGameState((prev) => ({ ...prev, gameId: id }))
  }, [])

  useEffect(() => {
    const { config, status, currentTurn, board } = gameState
    if (config.mode !== "bot") return
    if (status !== "in-progress") return
    if (currentTurn !== "O") return

    const difficulty = config.aiDifficulty ?? "easy"

    const runBot = async () => {
      let getBotMove: (
        state: { player: string[]; bot: string[] },
        lastMove: string,
        tableSize: number
      ) => string | null

      if (difficulty === "hard") {
        const m = await import("@/utils/bots/hard")
        getBotMove = m.getBotMove
      } else if (difficulty === "medium") {
        const m = await import("@/utils/bots/medium")
        getBotMove = m.getBotMove
      } else {
        const m = await import("@/utils/bots/easy")
        getBotMove = m.getBotMove
      }

      const toUpper = (m: { row: number; col: number }) => toBotNotation(m.row, m.col)

      const lastUpperMove = gameState.moves.length > 0
        ? toUpper(gameState.moves[gameState.moves.length - 1])
        : ""

      const botUpperNotation = getBotMove(
        {
          player: playerMovesRef.current.map(toUpper),
          bot:    botMovesRef.current.map(toUpper),
        },
        lastUpperMove,
        config.gridSize
      )

      if (!botUpperNotation) return

      const { row, col } = fromBotNotation(botUpperNotation)
      if (row < 0 || row >= config.gridSize || col < 0 || col >= config.gridSize) return
      if (board[row][col] !== null) return

      setTimeout(() => placeMove(row, col), 300)
    }

    runBot()
  }, [gameState.currentTurn, gameState.status])

  useEffect(() => {
    const { status, winner, gameId, config } = gameState
    if (status !== "completed" && status !== "abandoned") return
    if (!gameId) return

    if (config.mode === "bot") {
      const outcome: "player" | "bot" | "draw" | "abandoned" =
        status === "abandoned" ? "abandoned"
        : winner === "draw"   ? "draw"
        : winner === "X"      ? "player"
        :                       "bot"

      apiSaveBotGame(
        gameId,
        playerMovesRef.current,
        botMovesRef.current,
        lastMoveRef.current,
        outcome
      )
    } else {
      apiSaveLocalGame(gameState)
    }
  }, [gameState.status])

  return (
    <GameContext.Provider value={{ gameState, initGame, placeMove, abortGame, resetGame, setGameId }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used inside GameProvider")
  return ctx
}

export default GameContext