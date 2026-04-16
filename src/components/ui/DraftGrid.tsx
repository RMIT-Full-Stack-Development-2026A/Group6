"use client"

import React from "react"

type DraftGridProps = {
  size?: number
  subtitle?: string
}

export default function DraftGrid({
  size,
  subtitle
}: DraftGridProps) {
  const total = size * size
  const displayTitle = `${size}×${size}`

  const tiles = Array.from({ length: total }).map((_, i) => (
    <div key={i} className="w-12 aspect-square bg-gray-300 rounded-md shadow-sm" />
  ))

  return (
    <section className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <div className="rounded-lg bg-white p-4">
        <div className="rounded-md bg-gray-50 p-4">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              gap: 12,
            }}
          >
            {tiles}
          </div>
        </div>

        <div className="h-1 bg-emerald-700 rounded-b-md mt-4" />

        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="text-2xl font-bold text-emerald-700">{displayTitle}</div>
          <div className="text-gray-600">{subtitle}</div>
          <div className="w-10 h-1 bg-emerald-700 rounded mt-2" />
        </div>
      </div>
    </section>
  )
}
