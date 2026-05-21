'use client';

import React from 'react';
import { useReplay } from '@/hooks/useReplay';

interface ReplayModalProps {
  gameId: string;
  onClose: () => void;
}

function colLabel(col: number): string {
  let result = '';
  let n = col;
  do {
    result = String.fromCharCode(97 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return result;
}

export default function ReplayModal({ gameId, onClose }: ReplayModalProps) {
  const {
    data, board, currentStep, totalSteps,
    isPlaying, isLoading, error, lastMove,
    play, pause, forward, backward, jumpTo,
  } = useReplay(gameId);

  const gridSize = data?.gridSize ?? 10;
  const currentMove = data && currentStep > 0 ? data.moves[currentStep - 1] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Match Replay</h2>
            {data && (
              <p className="text-xs text-gray-500 mt-0.5">
                {data.players.playerX?.username ?? 'Player X'} vs{' '}
                {data.players.playerO?.username ?? data.players.player2Name ?? 'Player O'}
                {' · '}
                {data.gridSize}×{data.gridSize} grid
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading replay…
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {data && !isLoading && (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="flex ml-6 mb-1">
                  {Array.from({ length: gridSize }).map((_, c) => (
                    <div
                      key={c}
                      className="text-center text-xs text-gray-400 font-mono"
                      style={{ width: `${Math.min(36, Math.floor(480 / gridSize))}px` }}
                    >
                      {colLabel(c)}
                    </div>
                  ))}
                </div>

                <div className="flex">
                  <div className="flex flex-col mr-1">
                    {Array.from({ length: gridSize }).map((_, r) => (
                      <div
                        key={r}
                        className="flex items-center justify-end pr-1 text-xs text-gray-400 font-mono"
                        style={{ height: `${Math.min(36, Math.floor(480 / gridSize))}px` }}
                      >
                        {gridSize - r}
                      </div>
                    ))}
                  </div>

                  <div
                    className="border border-gray-300 rounded overflow-hidden"
                    style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                  >
                    {board.map((row, r) =>
                      row.map((cell, c) => {
                        const isLast = lastMove?.row === r && lastMove?.col === c;
                        const cellSize = Math.min(36, Math.floor(480 / gridSize));
                        return (
                          <div
                            key={`${r}-${c}`}
                            className={`border border-gray-200 flex items-center justify-center font-bold transition-colors ${
                              isLast ? 'bg-yellow-100' : 'bg-white'
                            }`}
                            style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.45 }}
                          >
                            {cell && (
                              <span className={cell === 'X' ? 'text-[#006948]' : 'text-blue-600'}>
                                {cell === 'X' ? data.customization.markerX : data.customization.markerO}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar: controls + move log */}
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Step info */}
                <div className="text-center text-sm text-gray-600">
                  Move <span className="font-bold text-gray-900">{currentStep}</span> of{' '}
                  <span className="font-bold text-gray-900">{totalSteps}</span>
                  {currentMove && (
                    <span className="ml-2 text-xs text-gray-400 font-mono">
                      [{currentMove.position.algebraic}]
                    </span>
                  )}
                </div>

                {/* Progress slider */}
                <input
                  type="range"
                  min={0}
                  max={totalSteps}
                  value={currentStep}
                  onChange={(e) => jumpTo(Number(e.target.value))}
                  className="w-full accent-[#006948]"
                />

                {/* Playback controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={backward}
                    disabled={currentStep === 0}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    title="Backward"
                  >
                    ◀◀
                  </button>

                  {isPlaying ? (
                    <button
                      onClick={pause}
                      className="w-12 h-12 rounded-full bg-[#006948] text-white flex items-center justify-center hover:bg-[#005538]"
                      title="Pause"
                    >
                      ⏸
                    </button>
                  ) : (
                    <button
                      onClick={play}
                      disabled={currentStep === totalSteps}
                      className="w-12 h-12 rounded-full bg-[#006948] text-white flex items-center justify-center hover:bg-[#005538] disabled:opacity-40"
                      title="Play"
                    >
                      ▶
                    </button>
                  )}

                  <button
                    onClick={forward}
                    disabled={currentStep === totalSteps}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    title="Forward"
                  >
                    ▶▶
                  </button>
                </div>

                {/* Move log */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Move Log
                  </div>
                  <div className="overflow-y-auto max-h-60 divide-y divide-gray-100">
                    {data.moves.length === 0 && (
                      <div className="px-3 py-4 text-sm text-gray-400 text-center">No moves recorded</div>
                    )}
                    {data.moves.map((m, idx) => {
                      const isActive = idx < currentStep;
                      const isCurrent = idx === currentStep - 1;
                      return (
                        <button
                          key={idx}
                          onClick={() => jumpTo(idx + 1)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                            isCurrent
                              ? 'bg-yellow-50 font-semibold'
                              : isActive
                              ? 'bg-gray-50 text-gray-700'
                              : 'text-gray-400'
                          } hover:bg-yellow-50`}
                        >
                          <span className="text-xs text-gray-400 w-5 text-right flex-shrink-0">{idx + 1}.</span>
                          <span
                            className={`font-bold text-xs w-5 flex-shrink-0 ${
                              m.symbol === 'X' ? 'text-[#006948]' : 'text-blue-600'
                            }`}
                          >
                            {m.symbol === 'X' ? data.customization.markerX : data.customization.markerO}
                          </span>
                          <span className="font-mono text-xs">{m.position.algebraic}</span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {m.player && typeof m.player === 'object' ? m.player.username : 'Bot'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Result banner */}
                {data.result && (
                  <div className="text-center py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600">
                    Result:{' '}
                    <span className="font-bold text-gray-900">
                      {data.result === 'draw'
                        ? 'Draw'
                        : data.result === 'X'
                        ? `${data.players.playerX?.username ?? 'X'} wins`
                        : `${data.players.playerO?.username ?? 'O'} wins`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}