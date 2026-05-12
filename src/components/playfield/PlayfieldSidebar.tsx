"use client"

import React from "react"
import { useGame } from "@/context/gameContext"
import { useGameTimer } from "@/hooks/useGameTimer"

export default function PlayfieldSidebar() {
  const { gameState, abortGame, resetGame } = useGame()
  const { config, currentTurn, status, winner, moves } = gameState
  const { player1Name, player2Name, markerX, markerO } = config

  const timer = useGameTimer(status)
  const isFinished = status === "completed" || status === "abandoned"

  const currentPlayerName = currentTurn === "X" ? player1Name : player2Name
  const currentMarker     = currentTurn === "X" ? markerX     : markerO

  const p1Moves = moves.filter((m) => m.symbol === "X").length
  const p2Moves = moves.filter((m) => m.symbol === "O").length

  return (
    <aside className="w-80 ml-6 flex flex-col gap-4">

      
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg">
            {markerX}
          </span>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Player 1</div>
            <div className="font-semibold text-gray-800">{player1Name}</div>
          </div>
          <span className="ml-auto text-sm text-gray-400">{p1Moves} moves</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
            {markerO}
          </span>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Player 2</div>
            <div className="font-semibold text-gray-800">{player2Name}</div>
          </div>
          <span className="ml-auto text-sm text-gray-400">{p2Moves} moves</span>
        </div>
      </div>

    
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="text-xs text-emerald-700 uppercase tracking-wide font-semibold mb-1">
          {isFinished ? "Match Result" : "Current Turn"}
        </div>

        {!isFinished ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{currentPlayerName}</span>
            <span className="text-sm text-gray-500">({currentMarker})</span>
          </div>
        ) : status === "abandoned" ? (
          <div className="text-gray-500 font-semibold">Aborted</div>
        ) : winner === "draw" ? (
          <div className="text-yellow-600 font-bold">Draw </div>
        ) : (
          <div className="text-emerald-700 font-bold">
            {winner === "X" ? player1Name : player2Name} wins 
          </div>
        )}

        <div className="mt-3 text-3xl font-bold font-mono text-emerald-700">{timer}</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Total Moves</div>
            <div className="font-bold text-xl">{moves.length}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400">Grid</div>
            <div className="font-bold text-xl">{config.gridSize}×{config.gridSize}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {!isFinished && (
            <button
              onClick={abortGame}
              className="w-full py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
            >
              Abort Game
            </button>
          )}
          {isFinished && (
            <button
              onClick={resetGame}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
            >
              Play Again
            </button>
          )}
          <button
            onClick={() => window.history.back()}
            className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
          >
            Exit to Menu
          </button>
        </div>
      </div>

      
      {moves.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
            Move Log
          </div>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
            {[...moves].reverse().map((m, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    m.symbol === "X"
                      ? "bg-rose-100 text-rose-600"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {m.symbol === "X" ? markerX : markerO}
                </span>
                <span className="font-mono">{m.algebraic}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {m.symbol === "X" ? player1Name : player2Name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </aside>
  )
}