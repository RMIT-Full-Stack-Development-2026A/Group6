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
  const navItems = [
    {
      key: 'profile' as const,
      label: 'Profile Info',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      key: 'history' as const,
      label: 'Game History',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      key: 'security' as const,
      label: 'Security',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      key: 'subscription' as const,
      label: 'Subscription',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-6">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-5">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
          <img
            src={user.profile.avatar || '/angelina.png'}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-base font-semibold mt-3 text-gray-900">{user.username}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
        {subscription?.name === 'Premium' && (
          <div className="mt-2 bg-[#006948] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><polyline points="20 6 9 17 4 12"/></svg>
            <span>PREMIUM</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      {isOwnProfile && (
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeSection === item.key
                  ? 'bg-[#EAF4EF] text-[#006948]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={activeSection === item.key ? 'text-[#006948]' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}