"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, deactivateUser, reactivateUser, deleteUser } from "@/services/adminUserManagement.service";
import { getRooms, closeRoom, spectateRoom } from "@/services/adminGameRooms.service";
import { logout } from "@/services/authService";
import type { User } from "@/services/adminUserManagement.service";
import type { Room } from "@/services/adminGameRooms.service";

export type AdminTabType = "users" | "rooms";

export interface RoomFilters {
  gameMode: string;
  status: string;
  aiDifficulty: string;
}

export interface UseAdminDashboardResult {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  users: User[];
  rooms: Room[];
  loading: boolean;
  showRegisterModal: boolean;
  searchQuery: string;
  roomSearchQuery: string;
  showRoomFilters: boolean;
  roomFilters: RoomFilters;
  authChecked: boolean;
  filteredUsers: User[];
  filteredRooms: Room[];
  tabs: Array<{ id: AdminTabType; label: string; description: string }>;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  handleRegisterSuccess: () => Promise<void>;
  handleDeactivate: (userId: string) => Promise<void>;
  handleReactivate: (userId: string) => Promise<void>;
  handleDelete: (userId: string) => Promise<void>;
  handleSpectate: (roomId: string) => Promise<void>;
  handleCloseRoom: (roomId: string) => Promise<void>;
  toggleRoomFilters: () => void;
  handleRoomFilterChange: (field: keyof RoomFilters, value: string) => void;
  clearRoomFilters: () => void;
  handleLogout: () => Promise<void>;
  setSearchQuery: (value: string) => void;
  setRoomSearchQuery: (value: string) => void;
}

export default function useAdminDashboard(): UseAdminDashboardResult {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabType>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomSearchQuery, setRoomSearchQuery] = useState("");
  const [showRoomFilters, setShowRoomFilters] = useState(false);
  const [roomFilters, setRoomFilters] = useState<RoomFilters>({
    gameMode: "",
    status: "",
    aiDifficulty: "",
  });
  const [authChecked, setAuthChecked] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, roomsData] = await Promise.all([getUsers(), getRooms()]);
      setUsers(usersData);
      setRooms(roomsData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [loadData, router]);

  const handleDeactivate = useCallback(async (userId: string) => {
    try {
      await deactivateUser(userId);
      await loadData();
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  }, [loadData]);

  const handleReactivate = useCallback(async (userId: string) => {
    try {
      await reactivateUser(userId);
      await loadData();
    } catch (error) {
      console.error("Failed to reactivate user:", error);
    }
  }, [loadData]);

  const handleDelete = useCallback(async (userId: string) => {
    try {
      await deleteUser(userId);
      await loadData();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }, [loadData]);

  const handleSpectate = useCallback(async (roomId: string) => {
    try {
      await spectateRoom(roomId);
    } catch (error) {
      console.error("Failed to spectate room:", error);
    }
  }, []);

  const handleCloseRoom = useCallback(async (roomId: string) => {
    try {
      await closeRoom(roomId);
      await loadData();
    } catch (error) {
      console.error("Failed to close room:", error);
    }
  }, [loadData]);

  const openRegisterModal = useCallback(() => setShowRegisterModal(true), []);
  const closeRegisterModal = useCallback(() => setShowRegisterModal(false), []);
  const handleRegisterSuccess = useCallback(async () => {
    closeRegisterModal();
    await loadData();
  }, [closeRegisterModal, loadData]);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  const filteredRooms = useMemo(() => {
    const query = roomSearchQuery.toLowerCase();
    return rooms.filter((room) => {
      const matchesSearch =
        room.id.toLowerCase().includes(query) ||
        room.roomNo.toLowerCase().includes(query) ||
        room.player1.toLowerCase().includes(query) ||
        (room.player2 || "").toLowerCase().includes(query) ||
        room.gameMode?.toLowerCase().includes(query) ||
        room.status.toLowerCase().includes(query);

      const matchesGameMode = !roomFilters.gameMode || room.gameMode === roomFilters.gameMode;
      const matchesStatus = !roomFilters.status || room.status.toLowerCase().includes(roomFilters.status.toLowerCase());
      const matchesAiDifficulty =
        !roomFilters.aiDifficulty ||
        (room.aiDifficulty || "").toLowerCase() === roomFilters.aiDifficulty.toLowerCase();

      return matchesSearch && matchesGameMode && matchesStatus && matchesAiDifficulty;
    });
  }, [rooms, roomSearchQuery, roomFilters]);

  const toggleRoomFilters = useCallback(() => {
    setShowRoomFilters((prev) => !prev);
  }, []);

  const handleRoomFilterChange = useCallback((field: keyof RoomFilters, value: string) => {
    setRoomFilters((prev) => {
      if (field === "gameMode" && value !== "bot") {
        return {
          ...prev,
          gameMode: value,
          aiDifficulty: "",
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  const clearRoomFilters = useCallback(() => {
    setRoomFilters({ gameMode: "", status: "", aiDifficulty: "" });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/");
    }
  }, [router]);

  const tabs = useMemo(
    () => [
      { id: "users" as AdminTabType, label: "User Management", description: "Manage player accounts, roles, and permissions" },
      { id: "rooms" as AdminTabType, label: "Game Rooms", description: "Monitor and manage active and archived game rooms" },
    ],
    []
  );

  return {
    activeTab,
    setActiveTab,
    users,
    rooms,
    loading,
    showRegisterModal,
    searchQuery,
    roomSearchQuery,
    showRoomFilters,
    roomFilters,
    authChecked,
    filteredUsers,
    filteredRooms,
    tabs,
    openRegisterModal,
    closeRegisterModal,
    handleRegisterSuccess,
    handleDeactivate,
    handleReactivate,
    handleDelete,
    handleSpectate,
    handleCloseRoom,
    toggleRoomFilters,
    handleRoomFilterChange,
    clearRoomFilters,
    handleLogout,
    setSearchQuery,
    setRoomSearchQuery,
  };
}
