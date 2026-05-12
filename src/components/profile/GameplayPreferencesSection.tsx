"use client";

import React, { useState } from 'react';
import { User } from '@/services/userService';

interface GameplayPreferencesSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function GameplayPreferencesSection({ user, onUpdate }: GameplayPreferencesSectionProps) {
  const [preferred, setPreferred] = useState<'X' | 'O'>('X');

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006948" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        <h3 className="text-sm font-semibold text-gray-900">Gameplay Preferences</h3>
      </div>

      <div className="px-6 py-5">
        <p className="text-xs text-gray-500 mb-4">
          Select your default signature mark for all matches.
        </p>

        <div className="flex gap-3">
          {/* X Option */}
          <button
            onClick={() => setPreferred('X')}
            className={`relative flex-1 flex flex-col items-center justify-center py-6 border-2 rounded-lg transition-all ${
              preferred === 'X'
                ? 'border-[#006948] bg-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {/* Checkmark top-right when selected */}
            {preferred === 'X' && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#006948] rounded-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
            <span className={`text-5xl font-bold mb-3 leading-none ${preferred === 'X' ? 'text-[#006948]' : 'text-gray-300'}`}>
              ✕
            </span>
            <span className={`text-xs font-semibold tracking-wide ${preferred === 'X' ? 'text-[#006948]' : 'text-gray-400'}`}>
              PREFERRED X
            </span>
          </button>

          {/* O Option */}
          <button
            onClick={() => setPreferred('O')}
            className={`relative flex-1 flex flex-col items-center justify-center py-6 border-2 rounded-lg transition-all ${
              preferred === 'O'
                ? 'border-[#006948] bg-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {preferred === 'O' && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#006948] rounded-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
            <span className={`text-5xl font-bold mb-3 leading-none ${preferred === 'O' ? 'text-[#006948]' : 'text-gray-300'}`}>
              ○
            </span>
            <span className={`text-xs font-semibold tracking-wide ${preferred === 'O' ? 'text-[#006948]' : 'text-gray-400'}`}>
              SELECT O
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}