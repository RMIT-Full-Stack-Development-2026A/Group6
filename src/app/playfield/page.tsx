"use client"

import React, { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import PlayfieldBoard from "@/components/playfield/PlayfieldBoard"
import PlayfieldSidebar from "@/components/playfield/PlayfieldSidebar"
import { GameProvider, useGame, GameConfig, BoardStyle, GameMode } from "@/context/gameContext"

/** Reads URL params and starts the game. Must live inside GameProvider. */
function PlayfieldInner() {
  const { initGame } = useGame()
  const searchParams  = useSearchParams()
  const initialized   = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const mode       = (searchParams.get("mode")       ?? "local")   as GameMode
    const gridSize   =  parseInt(searchParams.get("gridSize") ?? "10", 10)
    const boardStyle = (searchParams.get("boardStyle") ?? "classic") as BoardStyle
    const markerX    =  searchParams.get("markerX")   ?? "X"
    const markerO    =  searchParams.get("markerO")   ?? "O"
    const p1         =  searchParams.get("p1")        ?? "Player 1"
    const p2         =  searchParams.get("p2")        ?? "Player 2"
    const firstTurn  = (searchParams.get("first")     ?? "X") as "X" | "O"
    const aiRaw      =  searchParams.get("ai")
    const aiDifficulty = (aiRaw ?? undefined) as GameConfig["aiDifficulty"]

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
  }, []) // intentionally runs once on mount only

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-7xl mx-auto flex gap-6 items-start flex-wrap">
        <PlayfieldBoard />
        <PlayfieldSidebar />
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