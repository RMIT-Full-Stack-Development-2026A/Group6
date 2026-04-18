"use client";

import React from 'react';
import { User, Subscription } from '@/services/userService';

interface ProfileSidebarProps {
  user: User;
  subscription?: Subscription | null;
  activeSection: 'profile' | 'history' | 'security' | 'subscription';
  onSectionChange: (section: 'profile' | 'history' | 'security' | 'subscription') => void;
  isOwnProfile: boolean;
}

export default function ProfileSidebar({
  user,
  subscription,
  activeSection,
  onSectionChange,
  isOwnProfile,
}: ProfileSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      {/* User Avatar & Info */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={user.profile.avatar || '/angelina.png'}
            alt={user.username}
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>
        <h2 className="text-xl font-semibold mt-4 text-gray-900">{user.username}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        {subscription?.name === 'Premium' && (
          <div className="mt-2 bg-[#006948] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <span>✓</span>
            <span>PREMIUM</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      {isOwnProfile && (
        <nav className="space-y-1">
          <button
            onClick={() => onSectionChange('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'profile'
                ? 'bg-[#E8F5F1] text-[#006948]'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">👤</span>
            <span>Profile Info</span>
          </button>

          <button
            onClick={() => onSectionChange('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'history'
                ? 'bg-[#E8F5F1] text-[#006948]'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">🎮</span>
            <span>Game History</span>
          </button>

          <button
            onClick={() => onSectionChange('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'security'
                ? 'bg-[#E8F5F1] text-[#006948]'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">🔒</span>
            <span>Security</span>
          </button>

          <button
            onClick={() => onSectionChange('subscription')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'subscription'
                ? 'bg-[#E8F5F1] text-[#006948]'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">💳</span>
            <span>Subscription</span>
          </button>
        </nav>
      )}
    </div>
  );
}