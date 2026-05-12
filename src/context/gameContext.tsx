"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

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

/** Converts col index to letter(s): 0→a, 25→z, 26→aa */
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

/** Check for 5 in a row from the last placed cell. Returns winning cells or null. */
function checkWin(
  board: CellValue[][],
  row: number,
  col: number,
  symbol: CellValue,
  gridSize: number
): [number, number][] | null {
  const directions: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  for (const [dr, dc] of directions) {
    const cells: [number, number][] = [[row, col]]

    for (let step = 1; step < 5; step++) {
      const r = row + dr * step
      const c = col + dc * step
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c] === symbol) {
        cells.push([r, c])
      } else break
    }
    for (let step = 1; step < 5; step++) {
      const r = row - dr * step
      const c = col - dc * step
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c] === symbol) {
        cells.push([r, c])
      } else break
    }

    if (cells.length >= 5) return cells.slice(0, 5)
  }
  return null
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

  const initGame = useCallback((config: GameConfig) => {
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
      gameId: null,
    })
  }, [])

  const placeMove = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.status !== "in-progress") return prev
      if (prev.board[row][col] !== null) return prev

      const { gridSize } = prev.config
      const symbol = prev.currentTurn
      const newBoard = prev.board.map((r) => [...r])
      newBoard[row][col] = symbol

      const algebraic = toAlgebraic(row, col, gridSize)
      const newMoves = [...prev.moves, { row, col, symbol, algebraic }]

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
    setGameState((prev) => ({
      ...prev,
      status: "abandoned",
      completedAt: new Date(),
    }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      board: makeEmptyBoard(prev.config.gridSize),
      currentTurn: prev.config.firstTurn,
      status: "in-progress",
      winner: null,
      winningCells: [],
      moves: [],
      startedAt: new Date(),
      completedAt: null,
    }))
  }, [])

  const setGameId = useCallback((id: string) => {
    setGameState((prev) => ({ ...prev, gameId: id }))
  }, [])

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