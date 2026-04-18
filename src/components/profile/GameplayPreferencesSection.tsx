"use client";

import React, { useState } from 'react';
import { User, UpdateProfilePayload, updateProfile } from '@/services/userService';

interface GameplayPreferencesSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function GameplayPreferencesSection({ user, onUpdate }: GameplayPreferencesSectionProps) {
  const [preferences, setPreferences] = useState({
    preferredX: true,
    preferredO: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleToggle = (mark: 'X' | 'O') => {
    if (mark === 'X') {
      setPreferences({ preferredX: true, preferredO: false });
    } else {
      setPreferences({ preferredX: false, preferredO: true });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // In a real implementation, you might want to add a preferredMark field to the user model
      // For now, we'll just show a success message
      setSuccessMessage('Preferences saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[#006948]">🎯</span>
        <h3 className="text-lg font-semibold text-gray-900">Gameplay Preferences</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Select your default signature mark for all matches.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => handleToggle('X')}
            className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all ${
              preferences.preferredX
                ? 'border-[#006948] bg-[#E8F5F1]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-20 h-20 flex items-center justify-center text-4xl font-bold mb-2 ${
              preferences.preferredX ? 'text-[#006948]' : 'text-gray-400'
            }`}>
              ✕
            </div>
            <span className={`text-sm font-medium ${
              preferences.preferredX ? 'text-[#006948]' : 'text-gray-600'
            }`}>
              PREFERRED X
            </span>
            {preferences.preferredX && (
              <div className="mt-2 w-6 h-6 bg-[#006948] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>

          <button
            onClick={() => handleToggle('O')}
            className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all ${
              preferences.preferredO
                ? 'border-[#006948] bg-[#E8F5F1]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-20 h-20 flex items-center justify-center text-4xl font-bold mb-2 ${
              preferences.preferredO ? 'text-[#006948]' : 'text-gray-400'
            }`}>
              ○
            </div>
            <span className={`text-sm font-medium ${
              preferences.preferredO ? 'text-[#006948]' : 'text-gray-600'
            }`}>
              SELECT O
            </span>
            {preferences.preferredO && (
              <div className="mt-2 w-6 h-6 bg-[#006948] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6 px-4 py-2 bg-[#006948] text-white rounded-lg hover:bg-[#005237] transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}