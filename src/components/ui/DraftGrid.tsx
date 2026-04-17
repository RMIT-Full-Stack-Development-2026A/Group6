"use client"

import React from "react"
import { useSelection } from "@/context/selection"

type DraftGridProps = {
  size?: number
  subtitle?: string
}

export default function DraftGrid({
  size,
  subtitle
}: DraftGridProps) {
  const gridSize = Math.max(1, Math.floor(size || 0)) // why not size right away? someone will try to negative int so no
  const total = gridSize * gridSize
  const displayTitle = `${gridSize} x ${gridSize}`
  const { selection, setSelection } = useSelection()
  const selected = selection.gridSize === gridSize

  // compact settings: shrink tiles when grid is large
  let tilePx = 48
  let gap = 12
  if (gridSize > 12) {
    tilePx = 22
    gap = 6
  } else if (gridSize > 8) {
    tilePx = 28
    gap = 8
  } else if (gridSize > 5) {
    tilePx = 36
    gap = 10
  }

  const gridWidth = gridSize * tilePx + (gridSize - 1) * gap
  // account for outer paddings: section p-6 (24px) + inner p-4 (16px) on both sides
  const paddingTotal = 2 * (24 + 16)
  const containerMax = Math.min(Math.max(gridWidth + paddingTotal, 300), 1200)

  const tiles = Array.from({ length: total }).map((_, i) => (
    <div
      key={i}
      style={{ width: `${tilePx}px`, height: `${tilePx}px` }}
      className="bg-gray-300 rounded-md shadow-sm"
    />
  ))

  return (
    <section
      className={`mx-auto bg-white rounded-xl shadow p-6 ${selected ? 'ring-2 ring-emerald-300' : ''}`}
      style={{ maxWidth: `${containerMax}px` }}
    >
      <div className="rounded-lg bg-white p-4">
        <div className="rounded-md bg-gray-50 p-4 overflow-hidden flex justify-center">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, ${tilePx}px)`,
              gap: gap,
              width: `${gridWidth}px`,
            }}
          >
            {tiles}
          </div>
        </div>

        <div className="h-1 bg-emerald-700 rounded-b-md mt-4" />

        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="text-2xl font-bold text-emerald-700">{displayTitle}</div>
          <div className="text-gray-600">{subtitle}</div>
          <div className="mt-2">
            <button
              onClick={() => setSelection({ ...selection, gridSize: size })}
              className="bg-transparent text-emerald-600 font-bold flex items-center gap-3 p-0 focus:outline-none"
            >
              <span>SELECT MODE</span>
              <span className="text-gray-400 font-semibold">→</span>
            </button>
          </div>
        </div>
        
      </div>
    </section>
  )
}
