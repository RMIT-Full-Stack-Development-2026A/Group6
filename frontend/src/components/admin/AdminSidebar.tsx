import React from "react";

type TabType = "users" | "rooms";

interface AdminSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout?: () => void;
  tabs: Array<{ id: TabType; label: string; description: string }>;
}

export default function AdminSidebar({ activeTab, onTabChange, onLogout, tabs }: AdminSidebarProps) {
  return (
    <div className="w-1/5 bg-gray-100 border-r border-gray-200 overflow-y-auto">
      <nav className="p-6 flex flex-col h-full justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Dashboard</h3>
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
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
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
