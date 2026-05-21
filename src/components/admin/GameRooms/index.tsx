import React from "react";
import GameRoomsHeader from "./GameRoomsHeader";
import GameRoomsTable from "./GameRoomsTable";
import { Room } from "@/services/adminGameRooms.service";

interface RoomFilters {
  gameMode?: string;
  status?: string;
  aiDifficulty?: string;
}

interface GameRoomsProps {
  rooms: Room[];
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onFilter?: () => void;
  onNewRoom?: () => void;
  onSpectate?: (roomId: string) => void;
  onClose?: (roomId: string) => void;
  showFilters?: boolean;
  roomFilters?: RoomFilters;
  onRoomFilterChange?: (field: keyof RoomFilters, value: string) => void;
  onClearFilters?: () => void;
}

export default function GameRooms({
  rooms,
  searchQuery,
  onSearchChange,
  onFilter,
  onNewRoom,
  onSpectate,
  onClose,
  showFilters = false,
  roomFilters,
  onRoomFilterChange,
  onClearFilters,
}: GameRoomsProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Rooms</h2>
      <p className="text-gray-600 mb-6">Monitor and manage active and archived game rooms</p>
      <div className="bg-white rounded-lg shadow p-8">
        <GameRoomsHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onFilter={onFilter}
          onNewRoom={onNewRoom}
        />
        {showFilters && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="grid gap-4 md:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Game Mode</span>
                <select
                  value={roomFilters?.gameMode ?? ""}
                  onChange={(e) => onRoomFilterChange?.("gameMode", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">All</option>
                  <option value="local">Local</option>
                  <option value="online">Online</option>
                  <option value="bot">Bot</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <select
                  value={roomFilters?.status ?? ""}
                  onChange={(e) => onRoomFilterChange?.("status", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">All</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">AI Difficulty</span>
                <select
                  value={roomFilters?.aiDifficulty ?? ""}
                  onChange={(e) => onRoomFilterChange?.("aiDifficulty", e.target.value)}
                  disabled={roomFilters?.gameMode !== "bot" && !!roomFilters?.gameMode}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">All</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>

                </select>
              </label>

              <div className="flex items-end justify-end gap-2">
                <button
                  onClick={onClearFilters}
                  type="button"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
        <GameRoomsTable rooms={rooms} onSpectate={onSpectate} onClose={onClose} />
      </div>
    </div>
  );
}
