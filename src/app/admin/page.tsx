"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import GameRooms from "@/components/admin/GameRooms";
import Settings from "@/components/admin/Settings";

type TabType = "users" | "rooms" | "settings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("users");

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
            onRegister={() => console.log("Register new player")}
            onDeactivate={(userId) => console.log("Deactivate user:", userId)}
            onReactivate={(userId) => console.log("Reactivate user:", userId)}
          />
        );
      case "rooms":
        return (
          <GameRooms
            onFilter={() => console.log("Filter rooms")}
            onNewRoom={() => console.log("Create new room")}
            onSpectate={(roomId) => console.log("Spectate room:", roomId)}
            onClose={(roomId) => console.log("Close room:", roomId)}
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
