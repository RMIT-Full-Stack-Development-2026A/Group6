"use client"

import React, { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import PlayfieldBoard from "@/components/playfield/PlayfieldBoard"
import PlayfieldSidebar from "@/components/playfield/PlayfieldSidebar"
import WinnerOverlay from "@/components/playfield/WinnerOverlay"
import { GameProvider, useGame, GameConfig, BoardStyle, GameMode } from "@/context/gameContext"

function PlayfieldInner() {
  const { initGame, gameState } = useGame()
  const searchParams = useSearchParams()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const get = (key: string, fallback: string) => searchParams?.get(key) ?? fallback

    const mode       = get("mode",       "local")   as GameMode
    const gridSize   = parseInt(get("gridSize", "10"), 10)
    const boardStyle = get("boardStyle", "classic") as BoardStyle
    const markerX    = get("markerX",   "X")
    const markerO    = get("markerO",   "O")
    const p1         = get("p1",        "Player 1")
    const p2         = get("p2",        "Player 2")
    const firstTurn  = get("first",     "X") as "X" | "O"
    const aiRaw      = searchParams?.get("ai") ?? undefined
    const aiDifficulty = aiRaw as GameConfig["aiDifficulty"]

    const config: GameConfig = {
      mode,
      gridSize:   isNaN(gridSize) ? 10 : Math.min(Math.max(gridSize, 3), 20),
      boardStyle,
      markerX,
      markerO,
      player1Name: p1,
      player2Name: p2,
      firstTurn,
      aiDifficulty,
    }

    initGame(config)
  }, [])

  const gridSize = gameState.config.gridSize
  const tileSize = gridSize <= 10 ? 52 : 36
  const gap = 4
  const boardPx = gridSize * tileSize + (gridSize - 1) * gap + 2 + 22 + 16

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <WinnerOverlay />
      <div
        className="mx-auto flex gap-6 items-start"
        style={{ width: "fit-content", maxWidth: "100%" }}
      >
        <div className="flex-shrink-0" style={{ width: boardPx }}>
          <PlayfieldBoard />
        </div>
        <div className="flex-shrink-0 w-72">
          <PlayfieldSidebar />
        </div>
      </div>
    </div>
  )
}

export default function PlayfieldPage() {
  return (
    <GameProvider>
      <PlayfieldInner />
    </GameProvider>
  )
}