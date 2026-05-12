"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useSelection } from "@/context/selection"
import matchtype from "#/data/gamemode.json"

export default function SelectedConfig() {
  const { selection } = useSelection()
  const router = useRouter()

  const [showModal, setShowModal] = useState(false)
  const [p1Name, setP1Name]       = useState("")
  const [p2Name, setP2Name]       = useState("")
  const [firstTurn, setFirstTurn] = useState<"X" | "O">("X")

  const mode = selection.mode
  const size = selection.gridSize
  const modeName = mode
    ? (matchtype.matchtype[mode as keyof typeof matchtype.matchtype]?.name ?? mode)
    : ""

  const canPlay = !!mode && !!size

  function handlePlay() {
    if (!canPlay) return
    setShowModal(true)
  }

  function handleStart() {
    if (!mode || !size) return

    const params = new URLSearchParams({
      mode,
      gridSize:   String(size),
      boardStyle: "classic",
      markerX:    "X",
      markerO:    "O",
      p1:         p1Name.trim() || "Player 1",
      p2:         p2Name.trim() || (mode === "bot" ? "AI Bot" : "Player 2"),
      first:      firstTurn,
      ...(mode === "bot" ? { ai: "easy" } : {}),
    })

    setShowModal(false)
    router.push(`/playfield?${params.toString()}`)
  }

  return (
    <>
      
      <div className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm">
        <div>
          <div className="text-sm text-gray-500">Selected Configuration</div>
          <div className="font-semibold text-gray-800">
            {mode && size
              ? `${modeName} • ${size}×${size} Grid`
              : "Nothing selected yet"}
          </div>
        </div>
        <button
          onClick={handlePlay}
          disabled={!canPlay}
          className="bg-emerald-800 disabled:opacity-40 text-white px-8 py-3 rounded-lg shadow hover:bg-emerald-700 transition"
        >
          Play
        </button>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Game Setup</h2>

            <label className="block mb-1 text-sm text-gray-500">Your Name (Player 1)</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Player 1"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
            />

            {mode !== "bot" && (
              <>
                <label className="block mb-1 text-sm text-gray-500">Player 2 Name</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Player 2"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                />
              </>
            )}

            <label className="block mb-1 text-sm text-gray-500">Who Goes First?</label>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setFirstTurn("X")}
                className={`flex-1 py-2 rounded-lg border font-semibold transition ${
                  firstTurn === "X"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p1Name.trim() || "Player 1"} (X)
              </button>
              <button
                onClick={() => setFirstTurn("O")}
                className={`flex-1 py-2 rounded-lg border font-semibold transition ${
                  firstTurn === "O"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {mode === "bot" ? "AI Bot" : (p2Name.trim() || "Player 2")} (O)
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStart}
                className="flex-1 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition font-semibold"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}