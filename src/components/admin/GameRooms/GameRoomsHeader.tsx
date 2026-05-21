import React from "react";

interface GameRoomsHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onFilter?: () => void;
  onNewRoom?: () => void;
}

export default function GameRoomsHeader({ searchQuery = "", onSearchChange, onFilter, onNewRoom }: GameRoomsHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Active Rooms</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onFilter}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-sm font-medium" 
          >
            Filter
          </button>
          <button
            onClick={onNewRoom}
            className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-sm font-medium"
          >
            New Room
          </button>
        </div>
      </div>
      <div className="w-full max-w-md">
        <label className="sr-only" htmlFor="room-search">
          Search rooms
        </label>
        <input
          id="room-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search room ID, player name, or game mode"
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
    </div>
  );
}
