"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useSelection } from "@/context/selection"
import matchtype from "#/data/gamemode.json"

type MatchTypeKey = "local" | "online" | "bot"

export default function SelectedConfig() {
  const { selection } = useSelection()
  const router = useRouter()

  const mode = selection.mode as MatchTypeKey
  const size = selection.gridSize

  const modeName = mode
    ? matchtype.matchtype[mode]?.name || mode
    : ""

  const canPlay = !!mode && !!size && mode !== "online"

  function handlePlay() {
    if (!canPlay) return

    const params = new URLSearchParams({
      mode,
      gridSize: String(size),
      boardStyle: "classic",
      markerX: "X",
      markerO: "O",
      p1: "Player 1",
      p2: mode === "bot" ? "Bot" : "Player 2",
      first: "X",
    })

    if (mode === "bot") {
      params.set("ai", "easy")
    }

    router.push(`/playfield?${params.toString()}`)
  }

  
  if (!mode && !size) return null

  return (
    <div className="flex items-center justify-between p-4 border rounded">
      <div>
        <div className="text-sm text-gray-600">
          Selected Configuration
        </div>

        <div className="font-semibold">
          {modeName} {size ? `• ${size}×${size} Grid` : ""}
        </div>

        {mode === "online" && (
          <p className="text-xs text-amber-600 mt-1">
            Online matchmaking is not yet available.
          </p>
        )}
      </div>

      <button
        onClick={handlePlay}
        disabled={!canPlay}
        className={`px-8 py-3 rounded shadow font-semibold transition-colors ${
          canPlay
            ? "bg-emerald-800 text-white hover:bg-emerald-700 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Play
      </button>
    </div>
  )
}