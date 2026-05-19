"use client"

import React from "react"
import { useSelection } from "@/context/selection"
import matchtype from "#/data/gamemode.json"

type MatchTypeKey = "local" | "online" | "bot"

export default function SelectedConfig() {
  const { selection } = useSelection()

  const mode = selection.mode as MatchTypeKey
  const size = selection.gridSize

  const modeName = mode
    ? matchtype.matchtype[mode]?.name || mode
    : ""

  return (
    <div className="flex items-center justify-between p-4 border rounded">
      <div>
        <div className="text-sm text-gray-600">
          Selected Configuration
        </div>

        <div className="font-semibold">
          {modeName} {size ? `• ${size}×${size} Grid` : ""}
        </div>
      </div>

      <button className="bg-emerald-800 text-white px-8 py-3 rounded shadow">
        Play
      </button>
    </div>
  )
}