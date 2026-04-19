"use client"

import React from "react"

export default function PlayfieldSidebar() {
  return (
    <aside className="w-80 ml-6">
      <div className="bg-white rounded p-6 shadow-sm mb-6">
        <div className="text-sm text-gray-500">PLAYER 1</div>
        <div className="text-lg font-bold">You</div>
        <div className="mt-4 text-sm text-gray-500">PLAYER 2</div>
        <div className="text-lg font-bold">Nexus-V</div>
      </div>

      <div className="bg-white rounded p-6 shadow-sm mb-6">
        <div className="text-sm text-emerald-700">CURRENT STATUS</div>
        <div className="text-lg font-bold">Your Turn</div>
        <div className="mt-4 text-3xl font-bold text-emerald-700">04:12</div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded p-3 text-center">
            <div className="text-sm">WINS</div>
            <div className="font-bold text-xl">12</div>
          </div>
          <div className="bg-gray-50 rounded p-3 text-center">
            <div className="text-sm">DRAWS</div>
            <div className="font-bold text-xl">4</div>
          </div>
        </div>

        <div className="mt-4">
          <button className="w-full py-3 bg-emerald-200 text-emerald-800 rounded">Reset Game</button>
          <button className="w-full py-3 mt-3 border rounded">Exit Game</button>
        </div>
      </div>

      <div className="bg-white rounded p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-emerald-700">LIVE STRATEGY INSIGHT</h4>
        <p className="text-sm text-gray-500 mt-2">AI Nexus-V is prioritizing the central sectors. You have a potential flanking maneuver in the upper-right quadrant.</p>
      </div>
    </aside>
  )
}
