"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import GameRooms from "@/components/admin/GameRooms";
import Settings from "@/components/admin/Settings";
import { getUsers, deactivateUser, reactivateUser } from "@/services/adminUserManagement.service";
import { getRooms, closeRoom, spectateRoom } from "@/services/adminGameRooms.service";
import type { User } from "@/services/adminUserManagement.service";
import type { Room } from "@/services/adminGameRooms.service";

type TabType = "users" | "rooms" | "settings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, roomsData] = await Promise.all([
          getUsers(),
          getRooms(),
        ]);
        setUsers(usersData);
        setRooms(roomsData);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const tabs: { id: TabType; label: string; description: string }[] = [
    { id: "users", label: "User Management", description: "Manage player accounts, roles, and permissions" },
    { id: "rooms", label: "Game Rooms", description: "Monitor and manage active and archived game rooms" },
    { id: "settings", label: "Settings", description: "Configure system settings and application features" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <UserManagement
            users={users}
            onRegister={() => console.log("Register new player")}
            onDeactivate={(userId) => deactivateUser(userId)}
            onReactivate={(userId) => reactivateUser(userId)}
          />
        );
      case "rooms":
        return (
          <GameRooms
            rooms={rooms}
            onFilter={() => console.log("Filter rooms")}
            onNewRoom={() => console.log("Create new room")}
            onSpectate={(roomId) => spectateRoom(roomId)}
            onClose={(roomId) => closeRoom(roomId)}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex h-screen">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
