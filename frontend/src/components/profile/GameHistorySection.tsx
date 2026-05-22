"use client"

import React, { useEffect, useState, useMemo } from "react"
import { Game, PlayerStats, getGameHistory, getPlayerStats } from "@/services/userService"
import ReplayModal from "@/components/profile/ReplayModal"

interface GameHistorySectionProps {
  userId?: string
  isOwnProfile: boolean
  isPremium?: boolean // passed from parent; gates the replay button
}

type ResultFilter = "all" | "win" | "lose" | "draw" | "aborted"
type ModeFilter   = "all" | "local" | "bot" | "online"
type SortDir      = "desc" | "asc"

function getCurrentUserId(): string | null {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) return null
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.id ?? payload._id ?? payload.userId ?? null
  } catch {
    return null
  }
}

function getResultLabel(game: Game): ResultFilter {
  if (!game.result || game.status === "abandoned") return "aborted"
  if (game.result === "draw") return "draw"
  const myId = getCurrentUserId()
  const isX  = myId && game.players.playerX?._id === myId
  if ((isX && game.result === "X") || (!isX && game.result === "O")) return "win"
  return "lose"
}

export default function GameHistorySection({ userId, isOwnProfile, isPremium = false }: GameHistorySectionProps) {
  const [allGames, setAllGames]   = useState<Game[]>([])
  const [stats, setStats]         = useState<PlayerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [page, setPage]           = useState(1)
  const [total, setTotal]         = useState(0)
  const LIMIT = 50

  const [search, setSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateFrom, setDateFrom]   = useState("")
  const [dateTo, setDateTo]       = useState("")
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all")
  const [modeFilter, setModeFilter]     = useState<ModeFilter>("all")
  const [sortDir, setSortDir]           = useState<SortDir>("desc")

  // Replay state
  const [replayGameId, setReplayGameId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [userId, page])

  async function loadData() {
    setIsLoading(true)
    setError(null)
    try {
      const [gameData, statsData] = await Promise.all([
        getGameHistory(userId, page, LIMIT),
        getPlayerStats(userId),
      ])
      setAllGames(gameData.games)
      setTotal(gameData.total)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load game history")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredGames = useMemo(() => {
    let result = [...allGames]

    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter((g) => {
        const room = (g.roomCode || g._id.slice(-6)).toLowerCase()
        const p2   = (
          g.gameMode === "bot"    ? `ai bot ${g.aiDifficulty || ""}` :
          g.gameMode === "local"  ? g.players.player2Name || "" :
          g.players.playerO?.username || g.players.playerX?.username || ""
        ).toLowerCase()
        return room.includes(q) || p2.includes(q)
      })
    }

    if (modeFilter !== "all") {
      result = result.filter((g) => g.gameMode === modeFilter)
    }

    if (resultFilter !== "all") {
      result = result.filter((g) => getResultLabel(g) === resultFilter)
    }

    if (dateFrom) {
      const from = new Date(dateFrom).getTime()
      result = result.filter((g) => g.startedAt && new Date(g.startedAt).getTime() >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000
      result = result.filter((g) => g.startedAt && new Date(g.startedAt).getTime() <= to)
    }

    result.sort((a, b) => {
      const ta = a.startedAt ? new Date(a.startedAt).getTime() : 0
      const tb = b.startedAt ? new Date(b.startedAt).getTime() : 0
      return sortDir === "desc" ? tb - ta : ta - tb
    })

    return result
  }, [allGames, search, modeFilter, resultFilter, dateFrom, dateTo, sortDir])

  function formatDate(d: Date | string | null) {
    if (!d) return "N/A"
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }
  function formatTime(d: Date | string | null) {
    if (!d) return ""
    return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  }
  function formatDuration(s: Date | string | null, e: Date | string | null) {
    if (!s || !e) return "N/A"
    const diff = Math.abs(new Date(e).getTime() - new Date(s).getTime())
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return h > 0 ? `${h}h ${m}m` : `${m} min`
  }

  function ResultBadge({ game }: { game: Game }) {
    const label = getResultLabel(game)
    const map: Record<ResultFilter, { cls: string; text: string }> = {
      win:     { cls: "bg-green-100 text-green-700",  text: "WIN"     },
      lose:    { cls: "bg-red-100 text-red-700",      text: "LOSS"    },
      draw:    { cls: "bg-yellow-100 text-yellow-700",text: "DRAW"    },
      aborted: { cls: "bg-gray-100 text-gray-500",    text: "ABORTED" },
      all:     { cls: "bg-gray-100 text-gray-500",    text: "—"       },
    }
    const { cls, text } = map[label] ?? map.all
    return <span className={`px-2 py-1 text-xs rounded font-medium ${cls}`}>{text}</span>
  }

  function getOpponentName(game: Game) {
    if (game.gameMode === "bot") {
      const lvl = game.aiDifficulty ?? "easy"
      const names: Record<string, string> = { easy: "Jeremy (Easy)", medium: "Nexus (Medium)", hard: "Titan (Hard)" }
      return names[lvl] ?? "AI Bot"
    }
    if (game.gameMode === "local") return game.players.player2Name || "Local Player"
    return game.players.playerO?.username || game.players.playerX?.username || "Unknown"
  }

  if (isLoading) return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center h-64">
      <div className="text-gray-500">Loading game history…</div>
    </div>
  )
  if (error) return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Replay modal */}
      {replayGameId && (
        <ReplayModal gameId={replayGameId} onClose={() => setReplayGameId(null)} />
      )}

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
        <p className="text-sm text-gray-600">Review your past architectural triumphs and challenges.</p>
      </div>

      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#006948] text-white rounded-lg p-5">
              <div className="text-xs uppercase tracking-wide mb-1 opacity-80">Win Rate</div>
              <div className="text-3xl font-bold">{stats.winRate.toFixed(1)}%</div>
              <div className="text-xs mt-1 opacity-70">{stats.wins}W / {stats.losses}L / {stats.draws}D</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Games</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalGames}</div>
              <div className="text-xs text-gray-400 mt-1">all modes</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Best Streak</div>
              <div className="text-3xl font-bold text-gray-900">{stats.bestWinStreak}</div>
              <div className="text-xs text-gray-400 mt-1">current: {stats.currentWinStreak}</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Play Time</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalPlayTime}<span className="text-base font-normal">m</span></div>
              <div className="text-xs text-gray-400 mt-1">total minutes</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["local","bot","online"] as const).map((key) => {
              const labels: Record<string, string> = { local: "🎮 Local", bot: "🤖 vs Bot", online: "👥 Online" }
              const borders: Record<string, string> = { local: "border-blue-200", bot: "border-purple-200", online: "border-orange-200" }
              const s = stats.stats[key]
              return (
                <div key={key} className={`bg-white border-2 ${borders[key]} rounded-lg p-4`}>
                  <div className="text-sm font-semibold text-gray-700 mb-3">{labels[key]}</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><div className="text-lg font-bold text-emerald-600">{s.wins}</div><div className="text-xs text-gray-400">W</div></div>
                    <div><div className="text-lg font-bold text-red-500">{s.losses}</div><div className="text-xs text-gray-400">L</div></div>
                    <div><div className="text-lg font-bold text-gray-500">{s.draws}</div><div className="text-xs text-gray-400">D</div></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center">{s.games} games total</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Room Number or Player 2 Name…"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006948] focus:border-transparent text-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters ? "bg-[#006948] text-white border-[#006948]" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Advanced Filters {showFilters ? "▲" : "▼"}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">From Date</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006948] focus:border-transparent" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">To Date</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006948] focus:border-transparent" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</label>
              <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value as ResultFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006948] focus:border-transparent bg-white">
                <option value="all">All Results</option>
                <option value="win">Win</option>
                <option value="lose">Loss</option>
                <option value="draw">Draw</option>
                <option value="aborted">Aborted</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Game Type</label>
              <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value as ModeFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006948] focus:border-transparent bg-white">
                <option value="all">All Types</option>
                <option value="local">Single Player (Local)</option>
                <option value="bot">vs AI Bot</option>
                <option value="online">Online Match</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By Date</label>
              <select value={sortDir} onChange={(e) => setSortDir(e.target.value as SortDir)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006948] focus:border-transparent bg-white">
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); setResultFilter("all"); setModeFilter("all"); setSortDir("desc") }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["ROOM #","GAME TYPE","OPPONENT","DATE","DURATION","RESULT", isPremium ? "REPLAY" : ""].filter(Boolean).map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={isPremium ? 7 : 6} className="px-6 py-12 text-center text-gray-500">
                    {search || resultFilter !== "all" || modeFilter !== "all" || dateFrom || dateTo
                      ? "No games match your filters."
                      : "No games played yet"}
                  </td>
                </tr>
              ) : (
                filteredGames.map((game) => (
                  <tr key={game._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{game.roomCode || game._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <span>{game.gameMode === "online" ? "👥" : game.gameMode === "bot" ? "🤖" : "🎮"}</span>
                        <span className="capitalize">{game.gameMode === "local" ? "Two Players" : game.gameMode === "bot" ? "Single Player" : "Online Match"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getOpponentName(game)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(game.startedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(game.startedAt)} – {formatTime(game.completedAt)}</div>
                      <div className="text-xs text-gray-500">{formatDuration(game.startedAt, game.completedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ResultBadge game={game} />
                    </td>
                    {isPremium && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {game.status === "completed" ? (
                          <button
                            onClick={() => setReplayGameId(game._id)}
                            className="px-3 py-1 text-xs font-medium rounded-md bg-[#006948] text-white hover:bg-[#005538] transition-colors"
                          >
                            Watch
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > LIMIT && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} games
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">←</button>
              <button className="px-3 py-1 bg-[#006948] text-white rounded text-sm">{page}</button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page * LIMIT >= total}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">→</button>
            </div>
          </div>
        )}
      </div>

      {!isPremium && isOwnProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <span className="font-semibold">Upgrade to Premium</span> to unlock match replays — step through every move with full Pause, Resume, Forward, and Backward controls.
        </div>
      )}
    </div>
  )
}