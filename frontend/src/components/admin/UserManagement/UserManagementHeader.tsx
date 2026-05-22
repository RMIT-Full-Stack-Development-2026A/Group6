import React from "react";

interface UserManagementHeaderProps {
  onRegister?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function UserManagementHeader({ onRegister, searchQuery = "", onSearchChange }: UserManagementHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600">Manage player accounts, roles, and permissions</p>
        </div>
        <button
          onClick={onRegister}
          className="ml-auto rounded-sm bg-green-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-900"
        >
          Register New Player
        </button> 
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <label className="sr-only" htmlFor="user-search">
            Search users
          </label>
          <input
            id="user-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search username or email"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>
    </div>
  );
}
