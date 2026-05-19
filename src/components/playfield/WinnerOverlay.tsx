"use client"

import React, { useEffect, useState } from "react"
import { useGame } from "@/context/gameContext"

export default function WinnerOverlay() {
  const { gameState, resetGame } = useGame()
  const { status, winner, config } = gameState
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (status === "completed" && !dismissed) {
      const t = setTimeout(() => setVisible(true), 200)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [status, dismissed])

  useEffect(() => {
    setDismissed(false)
  }, [gameState.startedAt])

  if (!visible || dismissed) return null

  const isDraw = winner === "draw"
  const winnerName = winner === "X" ? config.player1Name : config.player2Name
  const winnerMarker = winner === "X" ? config.markerX : config.markerO

  const overlayColor = isDraw
    ? "from-yellow-400/80 via-orange-300/80 to-yellow-400/80"
    : winner === "X"
    ? "from-rose-500/80 via-pink-400/80 to-rose-500/80"
    : "from-emerald-500/80 via-teal-400/80 to-emerald-500/80"

  const glowColor = isDraw ? "shadow-yellow-400" : winner === "X" ? "shadow-rose-400" : "shadow-emerald-400"
  const ringColor = isDraw ? "ring-yellow-300" : winner === "X" ? "ring-rose-300" : "ring-emerald-300"

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${overlayColor} backdrop-blur-sm`}
      style={{ animation: "fadeInOverlay 0.4s ease-out" }}
      onClick={() => setDismissed(true)}
    >
      <div
        className={`relative bg-white rounded-3xl px-12 py-10 flex flex-col items-center gap-4 shadow-2xl ${glowColor} ring-4 ${ringColor}`}
        style={{ animation: "popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {!isDraw && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#f43f5e", "#10b981", "#f59e0b", "#3b82f6", "#a855f7"][i % 5],
                  left: `${5 + (i * 5.5) % 90}%`,
                  animation: `confettiFall ${0.8 + (i % 4) * 0.3}s ease-in ${i * 0.07}s both`,
                  top: "-10%",
                }}
              />
            ))}
          </div>
        )}

        
        {!isDraw && (
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold shadow-lg ${
              winner === "X" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"
            }`}
            style={{ animation: "spinIn 0.5s ease-out" }}
          >
            {winnerMarker}
          </div>
        )}

        {isDraw ? (
          <>
            <div className="text-6xl" style={{ animation: "bounce 1s infinite" }}>🤝</div>
            <h2 className="text-4xl font-extrabold text-yellow-600 tracking-tight">It&apos;s a Draw!</h2>
            <p className="text-gray-500 text-sm">Great game from both sides!</p>
          </>
        ) : (
          <>
            <h2
              className="text-4xl font-extrabold tracking-tight"
              style={{
                background: winner === "X"
                  ? "linear-gradient(90deg,#f43f5e,#fb7185)"
                  : "linear-gradient(90deg,#10b981,#34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 1.5s linear infinite",
                backgroundSize: "200%",
              }}
            >
              {winnerName} Wins!
            </h2>
            <p className="text-gray-500 text-sm">Congratulations on the victory! 🎉</p>
          </>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => { setDismissed(true); resetGame() }}
            className={`px-6 py-2.5 rounded-xl text-white font-semibold shadow transition-transform hover:scale-105 ${
              isDraw ? "bg-yellow-500 hover:bg-yellow-600" : winner === "X" ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            Play Again
          </button>
          <button
            onClick={() => { setDismissed(true); window.history.back() }}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-transform hover:scale-105"
          >
            Exit
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-1">Click outside to dismiss</p>
      </div>

      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6) translateY(40px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spinIn {
          from { transform: rotate(-180deg) scale(0); opacity: 0; }
          to   { transform: rotate(0deg) scale(1);   opacity: 1; }
        }
        @keyframes confettiFall {
          from { transform: translateY(0) rotate(0deg); opacity: 1; }
          to   { transform: translateY(320px) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmer {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}