import React from "react";

interface UserManagementHeaderProps {
  onRegister?: () => void;
}

export default function UserManagementHeader({ onRegister }: UserManagementHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">Manage player accounts, roles, and permissions</p>
      </div>
      <button
        onClick={onRegister}
        className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-sm font-bold whitespace-nowrap ml-4"
      >
        Register New Player
      </button>
    </div>
  );
}
