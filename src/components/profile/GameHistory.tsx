"use client"

import React, { useEffect, useState } from "react"

type GameRow = {
  room: string
  type: string
  opponent: string
  time: string
  duration: string
  result: string
}

export default function GameHistory() {
  const [rows, setRows] = useState<GameRow[]>([])

  useEffect(() => {
    fetch('/data/gamehistory.json')
      .then(r => r.json())
      .then(data => setRows(data))
      .catch(() => setRows([]))
  }, [])

  return (
    <section className="bg-white rounded-md p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-emerald-700">PERFORMANCE ARCHIVE</div>
          <h2 className="text-2xl font-bold">Game History</h2>
          <div className="text-sm text-gray-500">Review your past architectural triumphs and challenges.</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Matches:</div>
          <div className="font-bold text-xl">1,284</div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <input placeholder="Search by Room Number or Player 2 Name..." className="flex-1 p-3 bg-gray-100 rounded" />
        <button className="px-4 py-2 bg-gray-100 rounded">Advanced Filters</button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-500 border-b">
            <th className="py-3">Room #</th>
            <th>Game Type</th>
            <th>Opponent</th>
            <th>Duration</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="text-sm text-gray-700 border-b">
              <td className="py-4">{r.room}</td>
              <td>{r.type}</td>
              <td>{r.opponent}</td>
              <td>{r.duration}</td>
              <td>
                <span className={`px-3 py-1 rounded-full text-xs ${r.result === 'WIN' ? 'bg-emerald-100 text-emerald-700' : r.result === 'LOSS' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                  {r.result}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-sm text-gray-500">Showing 1-10 of 1,284 games</div>
    </section>
  )
}
