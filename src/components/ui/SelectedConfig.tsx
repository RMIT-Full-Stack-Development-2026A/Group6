"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelection } from "@/context/selection"
import matchtype from "#/data/gamemode.json"

type MatchTypeKey = "local" | "online" | "bot"
type Difficulty = "easy" | "medium" | "hard"
type BoardStyle = "classic" | "mint" | "dark"

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: "easy", label: "Easy", description: "Random moves, beginner-friendly" },
  { value: "medium", label: "Medium", description: "Balanced challenge" },
  { value: "hard", label: "Hard", description: "Optimal play, tough to beat" },
]

function getSavedBoardStyle(): BoardStyle {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) return "classic"
    const cached = localStorage.getItem("userPreferences")
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed?.theme) return parsed.theme as BoardStyle
    }
  } catch {
  }
  return "classic"
}

export default function SelectedConfig() {
  const { selection } = useSelection()
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [boardStyle, setBoardStyle] = useState<BoardStyle>("classic")

  useEffect(() => {
    setBoardStyle(getSavedBoardStyle())
  }, [])

  const mode = selection.mode as MatchTypeKey
  const size = selection.gridSize

  const modeName = mode ? matchtype.matchtype[mode]?.name || mode : ""

  const canPlay = !!mode && !!size && mode !== "online"

  function handlePlay() {
    if (!canPlay) return

    const params = new URLSearchParams({
      mode,
      gridSize: String(size),
      boardStyle,
      markerX: "X",
      markerO: "O",
      p1: "Player 1",
      p2: mode === "bot" ? "Bot" : "Player 2",
      first: "X",
    })

    if (mode === "bot") {
      params.set("ai", difficulty)
    }

    router.push(`/playfield?${params.toString()}`)
  }

  if (!mode && !size) return null

  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Selected Configuration</div>
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

      {mode === "bot" && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Bot Difficulty
          </p>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-left transition-all ${
                  difficulty === d.value
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <p className={`text-sm font-semibold ${difficulty === d.value ? "text-emerald-700" : "text-gray-800"}`}>
                  {d.label}
                </p>
                <p className="text-xs text-gray-500">{d.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}