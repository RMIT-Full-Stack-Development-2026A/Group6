"use client"

import React, { useMemo } from "react"
import { useGame } from "@/context/gameContext"


function colToAlpha(col: number): string {
  let result = ""
  let n = col
  do {
    result = String.fromCharCode(97 + (n % 26)) + result
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return result
}

const BOARD_STYLES = {
  classic: {
    wrapper: "bg-white",
    inner:   "bg-gray-50",
    cell:    "bg-white border border-gray-200 hover:bg-emerald-50",
    label:   "text-gray-400",
  },
  mint: {
    wrapper: "bg-emerald-50",
    inner:   "bg-emerald-100",
    cell:    "bg-emerald-50 border border-emerald-200 hover:bg-emerald-200",
    label:   "text-emerald-600",
  },
  dark: {
    wrapper: "bg-zinc-900",
    inner:   "bg-zinc-800",
    cell:    "bg-zinc-700 border border-zinc-600 hover:bg-zinc-600",
    label:   "text-zinc-400",
  },
}

export default function PlayfieldBoard() {
  const { gameState, placeMove } = useGame()
  const { board, status, winner, winningCells, config, isBotThinking } = gameState
  const { gridSize, boardStyle, markerX, markerO } = config

  const style = BOARD_STYLES[boardStyle] ?? BOARD_STYLES.classic

  const winSet = useMemo(
    () => new Set(winningCells.map(([r, c]) => `${r},${c}`)),
    [winningCells]
  )

  const isFinished = status === "completed" || status === "abandoned"
  const isLocked = isFinished || isBotThinking

  function handleClick(row: number, col: number) {
    if (isLocked) return
    if (board[row][col] !== null) return
    placeMove(row, col)
  }

 
  const tileSize = gridSize <= 10 ? 52 : 36
  const gap = 4
  const boardPx = gridSize * tileSize + (gridSize - 1) * gap + 2
  return (
    <div className={`rounded-xl shadow-md p-4 ${style.wrapper}`}>

    
      <div className="flex mb-1 pl-5" style={{ width: boardPx, gap }}>
        {Array.from({ length: gridSize }, (_, c) => (
          <div
            key={c}
            className={`text-center text-[10px] font-mono select-none ${style.label}`}
            style={{ width: tileSize, flexShrink: 0 }}
          >
            {colToAlpha(c)}
          </div>
        ))}
      </div>

      <div className="flex">
        
        <div className="flex flex-col mr-1" style={{ gap }}>
          {Array.from({ length: gridSize }, (_, r) => (
            <div
              key={r}
              className={`flex items-center justify-end pr-1 text-[10px] font-mono select-none ${style.label}`}
              style={{ height: tileSize, width: 18 }}
            >
              {r + 1}
            </div>
          ))}
        </div>

   
        <div
          className={`rounded-lg p-[2px] ${style.inner}`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
            gridTemplateRows:    `repeat(${gridSize}, ${tileSize}px)`,
            gap,
            width: boardPx,
          }}
        >
          {board.map((row, ri) =>
            row.map((cell, ci) => {
              const isWinCell = winSet.has(`${ri},${ci}`)
              const marker = cell === "X" ? markerX : cell === "O" ? markerO : null

              return (
                <button
                  key={`${ri}-${ci}`}
                  onClick={() => handleClick(ri, ci)}
                  disabled={isLocked || cell !== null}
                  className={[
                    "rounded-md flex items-center justify-center font-bold transition-all duration-100 select-none",
                    isLocked || cell !== null ? "cursor-default" : "cursor-pointer",
                    isWinCell
                      ? "bg-emerald-400 border-2 border-emerald-600 scale-105 shadow-md"
                      : style.cell,
                  ].join(" ")}
                  style={{ width: tileSize, height: tileSize }}
                  title={`${colToAlpha(ci)}${gridSize - ri}`}
                >
                  {marker && (
                    <span
                      className={[
                        "leading-none transition-all",
                        cell === "X" ? "text-rose-600" : "text-emerald-700",
                        isWinCell ? "scale-110" : "",
                      ].join(" ")}
                      style={{ fontSize: tileSize * 0.42 }}
                    >
                      {marker}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

     
      {isBotThinking && !isFinished && (
        <div className="mt-3 text-center">
          <p className="text-sm text-emerald-600 font-medium animate-pulse">Bot is thinking…</p>
        </div>
      )}

      {isFinished && (
        <div className="mt-4 text-center">
          {status === "abandoned" ? (
            <p className="text-gray-500 font-semibold">Game aborted — no result recorded.</p>
          ) : winner === "draw" ? (
            <p className="text-yellow-600 font-bold text-lg">It&apos;s a Draw! 🤝</p>
          ) : (
            <p className="text-emerald-700 font-bold text-lg animate-bounce">
              {winner === "X" ? config.player1Name : config.player2Name} wins! 🎉
            </p>
          )}
        </div>
      )}
    </div>
  )
}