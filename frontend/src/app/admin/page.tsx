"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import RegisterPlayerForm from "@/components/admin/UserManagement/RegisterPlayerForm";
import GameRooms from "@/components/admin/GameRooms";
import useAdminDashboard from "@/hooks/useAdminDashboard";

type TabType = "users" | "rooms";

export default function AdminPage() {
  const {
    activeTab,
    setActiveTab,
    filteredUsers,
    filteredRooms,
    searchQuery,
    showRegisterModal,
    roomSearchQuery,
    showRoomFilters,
    roomFilters,
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
  } = useAdminDashboard();

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
            onFilter={toggleRoomFilters}
            onSpectate={handleSpectate}
            onClose={handleCloseRoom}
            showFilters={showRoomFilters}
            roomFilters={roomFilters}
            onRoomFilterChange={handleRoomFilterChange}
            onClearFilters={clearRoomFilters}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex h-screen">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} tabs={tabs} />
        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
