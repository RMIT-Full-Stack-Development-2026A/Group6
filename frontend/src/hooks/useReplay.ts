import { useState, useEffect, useRef, useCallback } from 'react';
import { getGameMoves, ReplayData, ReplayMove } from '@/services/replayService';

export interface ReplayState {
  data: ReplayData | null;
  board: (string | null)[][];
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  lastMove: { row: number; col: number } | null;
}

export interface ReplayControls {
  play: () => void;
  pause: () => void;
  forward: () => void;
  backward: () => void;
  jumpTo: (step: number) => void;
}

function buildBoard(gridSize: number, moves: ReplayMove[], upTo: number): (string | null)[][] {
  const board: (string | null)[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(null)
  );
  for (let i = 0; i < upTo; i++) {
    const m = moves[i];
    board[m.position.row][m.position.col] = m.symbol;
  }
  return board;
}

export function useReplay(gameId: string | null): ReplayState & ReplayControls {
  const [data, setData] = useState<ReplayData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!gameId) return;
    setIsLoading(true);
    setError(null);
    setCurrentStep(0);
    setIsPlaying(false);
    getGameMoves(gameId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [gameId]);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying || !data) return;
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= data.moves.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, data]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const forward = useCallback(() => {
    if (!data) return;
    setCurrentStep((prev) => Math.min(prev + 1, data.moves.length));
  }, [data]);

  const backward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const jumpTo = useCallback((step: number) => {
    if (!data) return;
    setCurrentStep(Math.max(0, Math.min(step, data.moves.length)));
  }, [data]);

  const board = data ? buildBoard(data.gridSize, data.moves, currentStep) : [];
  const lastMove = data && currentStep > 0 ? data.moves[currentStep - 1].position : null;

  return {
    data,
    board,
    currentStep,
    totalSteps: data?.moves.length ?? 0,
    isPlaying,
    isLoading,
    error,
    lastMove,
    play,
    pause,
    forward,
    backward,
    jumpTo,
  };
}