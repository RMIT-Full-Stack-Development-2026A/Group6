const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

export interface ReplayMove {
  player: { _id: string; username: string } | string;
  position: { row: number; col: number; algebraic: string };
  symbol: 'X' | 'O';
  timestamp: string;
}

export interface ReplayData {
  gameId: string;
  gridSize: number;
  players: {
    playerX: { _id: string; username: string } | null;
    playerO: { _id: string; username: string } | null;
    player2Name?: string;
  };
  customization: {
    boardStyle: string;
    markerX: string;
    markerO: string;
  };
  result: 'X' | 'O' | 'draw' | null;
  status: string;
  moves: ReplayMove[];
}

export async function getGameMoves(gameId: string): Promise<ReplayData> {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication required');

  const res = await fetch(`${API_BASE}/api/games/${gameId}/moves`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load replay');
  return data.data as ReplayData;
}