"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import RegisterPlayerForm from "@/components/admin/UserManagement/RegisterPlayerForm";
import GameRooms from "@/components/admin/GameRooms";
import Settings from "@/components/admin/Settings";
import { getUsers, deactivateUser, reactivateUser, deleteUser } from "@/services/adminUserManagement.service";
import { getRooms, closeRoom, spectateRoom } from "@/services/adminGameRooms.service";
import type { User } from "@/services/adminUserManagement.service";
import type { Room } from "@/services/adminGameRooms.service";

type TabType = "users" | "rooms" | "settings";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomSearchQuery, setRoomSearchQuery] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

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

  useEffect(() => {
    const checkAuth = (): boolean => {
      const userData = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      if (!userData) {
        router.push("/login");
        return false;
      }

      try {
        const parsed = JSON.parse(userData);
        if (parsed.role !== "admin") {
          router.push("/");
          return false;
        }

        return true;
      } catch {
        router.push("/login");
        return false;
      }
    };

    if (!checkAuth()) {
      return;
    }

    loadData();
    setAuthChecked(true);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken" || event.key === "user") {
        if (!checkAuth()) {
          return;
        }
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const handleDeactivate = async (userId: string) => {
    try {
      await deactivateUser(userId);
      await loadData();
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };
 
  const handleReactivate = async (userId: string) => {
    try {
      await reactivateUser(userId);
      await loadData();
    } catch (error) {
      console.error("Failed to reactivate user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      await loadData();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const openRegisterModal = () => setShowRegisterModal(true);
  const closeRegisterModal = () => setShowRegisterModal(false);
  const handleRegisterSuccess = async () => {
    closeRegisterModal();
    await loadData();
  };

  const tabs: { id: TabType; label: string; description: string }[] = [
    { id: "users", label: "User Management", description: "Manage player accounts, roles, and permissions" },
    { id: "rooms", label: "Game Rooms", description: "Monitor and manage active and archived game rooms" },
    { id: "settings", label: "Settings", description: "Configure system settings and application features" },
  ];

  const filteredUsers = users.filter((user) =>
    user.username.includes(searchQuery) || user.email.includes(searchQuery)
  );

  const filteredRooms = rooms.filter((room) =>
    room.id.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
    room.roomNo.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
    room.gameMode?.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
    room.status.toLowerCase().includes(roomSearchQuery.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <>
            <UserManagement
              users={filteredUsers}
              onRegister={openRegisterModal}
              onDeactivate={handleDeactivate}
              onReactivate={handleReactivate}
              onDelete={handleDelete} 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            {showRegisterModal && (
              <RegisterPlayerForm
                onClose={closeRegisterModal}
                onSuccess={handleRegisterSuccess}
              />
            )}
          </>
        );
      case "rooms":
        return (
          <GameRooms
            rooms={filteredRooms}
            searchQuery={roomSearchQuery}
            onSearchChange={setRoomSearchQuery}
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
