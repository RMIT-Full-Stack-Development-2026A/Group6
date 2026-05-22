"use client"

import React, { useEffect, useRef, useState } from "react"
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

  const innerRef = useRef<HTMLDivElement | null>(null)
  const [containerPx, setContainerPx] = useState<number>(0)

  useEffect(() => {
    function measure() {
      const el = innerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setContainerPx(Math.floor(rect.width))
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const paddingRatio = 0.25
  let tilePx = 40
  let gapPx = Math.round(paddingRatio * tilePx)
  let gridWidth = 0

  if (containerPx > 0) {
    const denom = gridSize + (gridSize + 1) * paddingRatio
    tilePx = Math.floor(containerPx / denom)
    gapPx = Math.round(paddingRatio * tilePx)
    gridWidth = gridSize * tilePx + (gridSize - 1) * gapPx
  }

  const tiles = Array.from({ length: total }).map((_, i) => (
    <div
      key={i}
      style={{ width: `${tilePx}px`, height: `${tilePx}px` }}
      className="bg-gray-300 rounded-md shadow-sm"
    />
  ))
  /**
   * Thank you to Araki Tadao for proposing the idea of using math to calculate boxes size dynamically instead of static size
   * This should also resize based on viewport
   * The math base line should be:
   * (container size / number of tiles need) - (number of tiles needed + 1) * padding [this is including outside padding. If not included then it would be (numbers of tiles - 1)]
   */
  return (
    <section
      className={`w-full mx-auto bg-white rounded-xl shadow p-6 ${selected ? 'ring-2 ring-emerald-300' : ''}`}
    >
      <div className="rounded-lg bg-white p-4">
        <div ref={innerRef} className="rounded-md bg-gray-50 p-4 overflow-hidden flex justify-center">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, ${tilePx}px)`,
              gap: `${gapPx}px`,
              width: containerPx > 0 ? `${gridWidth}px` : 'auto',
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
              onClick={() => setSelection({ ...selection, gridSize })}
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
