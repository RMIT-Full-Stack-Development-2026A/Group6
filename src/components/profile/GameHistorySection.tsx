"use client";

import React, { useEffect, useState } from 'react';
import { Game, PlayerStats, getGameHistory, getPlayerStats } from '@/services/userService';

interface GameHistorySectionProps {
  userId?: string;
  isOwnProfile: boolean;
}

export default function GameHistorySection({ userId, isOwnProfile }: GameHistorySectionProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    loadData();
  }, [userId, currentPage]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [gameData, statsData] = await Promise.all([
        getGameHistory(userId, currentPage, 10),
        getPlayerStats(userId),
      ]);

      setGames(gameData.games);
      setTotalGames(gameData.total);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null | string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date | null | string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDuration = (start: Date | null | string, end: Date | null | string) => {
    if (!start || !end) return 'N/A';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hr ${minutes} m`;
    }
    return `${minutes} min`;
  };

  const getCurrentUserId = (): string | null => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      // JWT payload is the middle base64 segment
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id ?? payload._id ?? payload.userId ?? null;
    } catch {
      return null;
    }
  };

  const getResultBadge = (game: Game) => {
    if (game.result === 'draw') {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">DRAW</span>;
    }
    if (!game.result || game.status === 'abandoned') {
      return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded font-medium">ABORTED</span>;
    }
    const myId = getCurrentUserId();
    const playerXId = game.players.playerX?._id;
    // result is 'X' or 'O' — I'm playerX if my ID matches playerX
    const iAmX = myId && playerXId && myId === playerXId;
    const won = (iAmX && game.result === 'X') || (!iAmX && game.result === 'O');
    if (won) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">WIN</span>;
    }
    return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">LOSS</span>;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading game history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Archive Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Performance Archive</p>
            <h2 className="text-2xl font-bold text-gray-900">Game History</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Matches:</p>
            <p className="text-2xl font-bold text-[#006948]">{stats?.totalGames || 0}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Review your past architectural triumphs and challenges.
        </p>
      </div>

      {/* Stats Cards — always shown, zeros for new users */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#006948] text-white rounded-lg p-5">
            <div className="text-xs uppercase tracking-wide mb-1 opacity-80">Win Rate</div>
            <div className="text-3xl font-bold">{stats ? stats.winRate.toFixed(1) : '0.0'}%</div>
            <div className="text-xs mt-1 opacity-70">{stats ? `${stats.wins}W / ${stats.losses}L / ${stats.draws}D` : '—'}</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Games</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalGames ?? 0}</div>
            <div className="text-xs text-gray-400 mt-1">all modes</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Best Streak</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.bestWinStreak ?? 0}</div>
            <div className="text-xs text-gray-400 mt-1">current: {stats?.currentWinStreak ?? 0}</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Play Time</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalPlayTime ?? 0}<span className="text-base font-normal">m</span></div>
            <div className="text-xs text-gray-400 mt-1">total minutes</div>
          </div>
        </div>

        {/* Per-mode breakdown */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([ 
              { key: 'local' as const, label: '🎮 Local', color: 'border-blue-200' },
              { key: 'bot' as const, label: '🤖 vs Bot', color: 'border-purple-200' },
              { key: 'online' as const, label: '👥 Online', color: 'border-orange-200' },
            ]).map(({ key, label, color }) => {
              const s = stats.stats[key];
              return (
                <div key={key} className={`bg-white border-2 ${color} rounded-lg p-4`}>
                  <div className="text-sm font-semibold text-gray-700 mb-3">{label}</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-emerald-600">{s.wins}</div>
                      <div className="text-xs text-gray-400">W</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-500">{s.losses}</div>
                      <div className="text-xs text-gray-400">L</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-500">{s.draws}</div>
                      <div className="text-xs text-gray-400">D</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center">{s.games} games total</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by Room Number or Player 2 Name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006948] focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            ADVANCED FILTERS
          </button>
        </div>
      </div>

      {/* Game History Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROOM #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GAME TYPE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OPPONENT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DURATION
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RESULT
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No games played yet
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{game.roomCode || game._id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {game.gameMode === 'online' ? '👥' : game.gameMode === 'bot' ? '🤖' : '🎮'}
                        </span>
                        <span className="text-sm text-gray-900 capitalize">{game.gameMode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {game.gameMode === 'bot'
                          ? 'AI Bot'
                          : game.gameMode === 'local'
                          ? game.players.player2Name || 'Local Player'
                          : game.players.playerO?.username || game.players.playerX?.username || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {game.gameMode === 'bot' && game.aiDifficulty
                          ? `${game.aiDifficulty.toUpperCase()} BOT`
                          : game.gameMode === 'local'
                          ? 'LOCAL GUEST'
                          : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatTime(game.startedAt)} - {formatTime(game.completedAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDuration(game.startedAt, game.completedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getResultBadge(game)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalGames > 10 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalGames)} of {totalGames} games
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ←
              </button>
              <button className="px-3 py-1 bg-[#006948] text-white rounded text-sm">
                {currentPage}
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * 10 >= totalGames}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}