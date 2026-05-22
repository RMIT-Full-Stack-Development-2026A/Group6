import React from "react";
import GameRoomsHeader from "./GameRoomsHeader";
import GameRoomsTable from "./GameRoomsTable";
import { Room } from "@/services/adminGameRooms.service";

interface GameRoomsProps {
  rooms: Room[];
  onFilter?: () => void;
  onNewRoom?: () => void;
  onSpectate?: (roomId: string) => void;
  onClose?: (roomId: string) => void;
}

export default function GameRooms({
  rooms,
  onFilter,
  onNewRoom,
  onSpectate,
  onClose,
}: GameRoomsProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Rooms</h2>
      <p className="text-gray-600 mb-6">Monitor and manage active and archived game rooms</p>
      <div className="bg-white rounded-lg shadow p-8">
        <GameRoomsHeader onFilter={onFilter} onNewRoom={onNewRoom} />
        <GameRoomsTable rooms={rooms} onSpectate={onSpectate} onClose={onClose} />
      </div>
    </div>
  );
}
