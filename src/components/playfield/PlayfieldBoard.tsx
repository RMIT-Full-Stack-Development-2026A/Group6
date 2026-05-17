"use client"

import React from "react"

type PlayfieldProps = {
  rows?: number
  cols?: number
}

export default function PlayfieldBoard({ rows = 15, cols = 15 }: PlayfieldProps) {
  const cells = Array.from({ length: rows * cols })

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="bg-gray-50 p-6 rounded" style={{ boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.03)' }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 12,
            width: '640px',
            height: '640px',
          }}
        >
          {cells.map((_, i) => (
            <div key={i} className="bg-white border rounded-md" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.03)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
