"use client";

import React, { useState } from "react";

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
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600 mb-6">Manage player accounts, roles, and permissions</p>
            <div className="bg-white rounded-lg shadow p-8">
              <p className="text-gray-500">User management interface coming soon...</p>
              {/* TODO: Add user list table, search, filters, edit/delete actions */}
            </div>
          </div>
        );
      case "rooms":
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Rooms</h2>
            <p className="text-gray-600 mb-6">Monitor and manage active and archived game rooms</p>
            <div className="bg-white rounded-lg shadow p-8">
              <p className="text-gray-500">Game rooms interface coming soon...</p>
              {/* TODO: Add game rooms list, filters by status, room details modal */}
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600 mb-6">Configure system settings and application features</p>
            <div className="bg-white rounded-lg shadow p-8">
              <p className="text-gray-500">Settings interface coming soon...</p>
              {/* TODO: Add settings form (email config, features toggles, rate limits, etc.) */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content - Two Column Layout */}
      <div className="flex h-screen">
        {/* Left Sidebar - 1/5 width */}
        <div className="w-1/5 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h3>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Right Content Area - 4/5 width */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
