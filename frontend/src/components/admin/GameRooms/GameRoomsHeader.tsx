import React from "react";

interface GameRoomsHeaderProps {
  onFilter?: () => void;
  onNewRoom?: () => void;
}

export default function GameRoomsHeader({ onFilter, onNewRoom }: GameRoomsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Current Active Rooms</h3>
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
  );
}
