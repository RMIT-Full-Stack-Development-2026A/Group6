"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelection } from "@/context/selection"
import matchtype from "#/data/gamemode.json"

type MatchTypeKey = "local" | "online" | "bot"
type Difficulty = "easy" | "medium" | "hard"
type BoardStyle = "classic" | "mint" | "dark"

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: "easy",   label: "Easy",   description: "Random moves, beginner-friendly" },
  { value: "medium", label: "Medium", description: "Balanced challenge" },
  { value: "hard",   label: "Hard",   description: "Optimal play, tough to beat" },
]

const BOARD_STYLES: { value: BoardStyle; label: string; preview: string }[] = [
  { value: "classic", label: "Classic", preview: "bg-white border border-gray-200" },
  { value: "mint",    label: "Mint",    preview: "bg-emerald-50 border border-emerald-300" },
  { value: "dark",    label: "Dark",    preview: "bg-zinc-800 border border-zinc-600" },
]

const MARKERS: { value: string; label: string }[] = [
  { value: "X",  label: "X / O  (Default)" },
  { value: "♦",  label: "♦ / ♣  (Suits)" },
  { value: "★",  label: "★ / ☆  (Stars)" },
  { value: "▲",  label: "▲ / ▼  (Arrows)" },
  { value: "🌙", label: "🌙 / ☀️  (Sky)" },
  { value: "🐉", label: "🐉 / 🦅  (Beasts)" },
]

const MARKER_PAIRS: Record<string, string> = {
  "X":  "O",
  "♦":  "♣",
  "★":  "☆",
  "▲":  "▼",
  "🌙": "☀️",
  "🐉": "🦅",
}

const GRID_SIZES: { value: number; label: string }[] = [
  { value: 10, label: "Standard" },
  { value: 15, label: "Large" },
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
  } catch {}
  return "classic"
}

export default function SelectedConfig() {
  const { selection } = useSelection()
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [boardStyle, setBoardStyle] = useState<BoardStyle>("classic")
  const [markerKey, setMarkerKey] = useState<string>("X")
  const [gridSize, setGridSize] = useState<number>(10)
  const [p1Name, setP1Name] = useState("Player 1")
  const [p2Name, setP2Name] = useState("")

  const mode = selection.mode as MatchTypeKey
  const selectedSize = selection.gridSize ?? gridSize

  useEffect(() => {
    setBoardStyle(getSavedBoardStyle())
    if (selection.gridSize && GRID_SIZES.some(s => s.value === selection.gridSize)) {
      setGridSize(selection.gridSize)
    }
  }, [selection.gridSize])

  const markerX = markerKey
  const markerO = MARKER_PAIRS[markerKey] ?? "O"
  const modeName = mode ? matchtype.matchtype[mode]?.name || mode : ""
  const canPlay = !!mode && !!selectedSize && mode !== "online"

  function handlePlay() {
    if (!canPlay) return
    const resolvedP2 = p2Name.trim() || (mode === "bot" ? "Bot" : "Player 2")
    const params = new URLSearchParams({
      mode,
      gridSize: String(selectedSize),
      boardStyle,
      markerX,
      markerO,
      p1: p1Name.trim() || "Player 1",
      p2: resolvedP2,
      first: "X",
    })
    if (mode === "bot") params.set("ai", difficulty)
    router.push(`/playfield?${params.toString()}`)
  }

  if (!mode && !selectedSize) return null

  return (
    <div className="flex flex-col gap-6 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Selected Configuration</div>
          <div className="font-semibold text-gray-800">
            {modeName} {selectedSize ? `• ${selectedSize}×${selectedSize} Grid` : ""}
          </div>
          {mode === "online" && (
            <p className="text-xs text-amber-600 mt-1">Online matchmaking is not yet available.</p>
          )}
        </div>
        <button
          onClick={handlePlay}
          disabled={!canPlay}
          className={`px-8 py-3 rounded-lg shadow font-semibold transition-colors ${
            canPlay
              ? "bg-emerald-800 text-white hover:bg-emerald-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Play
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Board Size</p>
        <div className="flex gap-2">
          {GRID_SIZES.map(({ value: sz, label }) => (
            <button
              key={sz}
              type="button"
              onClick={() => setGridSize(sz)}
              className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all flex flex-col items-center gap-0.5 ${
                selectedSize === sz
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{sz}×{sz}</span>
              <span className="text-[10px] font-normal opacity-60">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Board Style</p>
        <div className="flex gap-2">
          {BOARD_STYLES.map((bs) => (
            <button
              key={bs.value}
              type="button"
              onClick={() => setBoardStyle(bs.value)}
              className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                boardStyle === bs.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className={`w-4 h-4 rounded-sm inline-block ${bs.preview}`} />
              {bs.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Markers</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MARKERS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMarkerKey(m.value)}
              className={`py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                markerKey === m.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Player 1 Name</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <span className="text-rose-600 font-bold text-lg w-6 text-center">{markerX}</span>
            <input
              type="text"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              placeholder="Player 1"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {mode === "bot" ? "Bot Name (auto)" : "Player 2 Name"}
          </label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <span className="text-emerald-700 font-bold text-lg w-6 text-center">{markerO}</span>
            <input
              type="text"
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              placeholder={mode === "bot" ? "Auto-assigned" : "Player 2"}
              disabled={mode === "bot"}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {mode === "bot" && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bot Difficulty</p>
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