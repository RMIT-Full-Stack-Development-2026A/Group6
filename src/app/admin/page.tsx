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
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">User Management</h2>
                <p className="text-gray-600">Manage player accounts, roles, and permissions</p>
              </div>
              <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-sm font-bold whitespace-nowrap ml-4">
                Register New Player
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-6 py-3 font-semibold text-gray-700">Username</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-700">Email</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-700">Premium Status</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-700">Account Status</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* This is just a sample row - replace with actual user data */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">Sample User</td>
                      <td className="px-6 py-4 text-gray-600">user@example.com</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-300 text-green-900 rounded-full text-sm font-bold">PREMIUM</span>
                      </td>
                      <td className="px-6 py-4 text-green-700 font-bold">Active</td>
                      <td className="px-6 py-4">
                        <button className="text-gray-800 hover:text-red-600 font-bold">Deactivate</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">John Doe</td>
                      <td className="px-6 py-4 text-gray-600">john.doe@example.com</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-bold">STANDAR</span>
                      </td>
                      <td className="px-6 py-4 text-red-600 font-bold">Deactivated</td>
                      <td className="px-6 py-4">
                        <button className="text-gray-800 hover:text-green-600 font-bold">Reactivate</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "rooms":
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Rooms</h2>
            <p className="text-gray-600 mb-6">Monitor and manage active and archived game rooms</p>
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Current Active Rooms</h3>
                <div className="flex gap-3">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-sm font-medium">
                    Filter
                  </button>
                  <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-sm font-medium">
                    New Room
                  </button>
                </div>
              </div>
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
                    {/* TODO: Populate with game rooms data from API */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 relative">
                        <span className="relative group cursor-pointer inline-block mr-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            Spectate
                          </span>
                        </span>
                        <span className="font-bold">R-001</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">Player A</td>
                      <td className="px-6 py-4 text-gray-600">Player B</td>
                      <td className="px-6 py-4 text-gray-600">2026-04-19 10:30</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-300 text-green-800 rounded-full text-sm font-bold">In Progress</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-red-600 hover:text-red-800 font-bold">Close</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 relative">
                        <span className="inline-block mr-2 w-5 h-5"></span>
                        <span className="font-bold">R-002</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">Player C</td>
                      <td className="px-6 py-4 text-gray-500">-</td>
                      <td className="px-6 py-4 text-gray-600">2026-04-19 11:15</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">In Lobby</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-red-600 hover:text-red-800 font-bold">Close</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
    <div className="min-h-screen bg-stone-50">

      <div className="flex h-screen">

        <div className="w-1/5 bg-gray-100 border-r border-gray-200 overflow-y-auto">
          <nav className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h3>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "text-green-700 font-bold border-r-4 border-green-600"
                      : "text-gray-700 font-medium hover:text-green-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
