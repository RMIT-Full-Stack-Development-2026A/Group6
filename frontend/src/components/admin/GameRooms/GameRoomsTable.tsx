import React from "react";
import { Room } from "@/services/adminGameRooms.service";

interface GameRoomsTableProps {
  rooms: Room[];
  onSpectate?: (roomId: string) => void;
  onClose?: (roomId: string) => void;
}

export default function GameRoomsTable({ rooms, onSpectate, onClose }: GameRoomsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Room #</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Player 1</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Player 2</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Created At</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-900 relative">
                {room.status === "In Progress" ? (
                  <span className="relative group cursor-pointer inline-block mr-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                      Spectate
                    </span>
                  </span>
                ) : (
                  <span className="inline-block mr-2 w-5 h-5"></span>
                )}
                <span className="font-bold">{room.roomNo}</span>
              </td>
              <td className="px-6 py-4 text-gray-600">{room.player1}</td>
              <td className="px-6 py-4 text-gray-600">{room.player2 || "-"}</td>
              <td className="px-6 py-4 text-gray-600">{room.createdAt}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    room.status === "In Progress"
                      ? "bg-green-300 text-green-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {room.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onClose?.(room.id)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  Close
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
