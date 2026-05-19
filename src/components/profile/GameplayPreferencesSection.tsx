"use client";

import React, { useState, useEffect } from 'react';
import { User, UpdateProfilePayload, updateProfile } from '@/services/userService';

interface GameplayPreferencesSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

type BoardTheme = 'classic' | 'mint' | 'dark';

const THEMES: {
  value: BoardTheme;
  label: string;
  description: string;
  preview: { bg: string; cell: string; dot: string };
}[] = [
  {
    value: 'classic',
    label: 'Classic',
    description: 'Clean white & gray',
    preview: { bg: 'bg-gray-50', cell: 'bg-white border border-gray-300', dot: 'bg-gray-400' },
  },
  {
    value: 'mint',
    label: 'Mint',
    description: 'Emerald green tones',
    preview: { bg: 'bg-emerald-100', cell: 'bg-emerald-50 border border-emerald-300', dot: 'bg-emerald-600' },
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Dark zinc board',
    preview: { bg: 'bg-zinc-800', cell: 'bg-zinc-700 border border-zinc-500', dot: 'bg-zinc-300' },
  },
];

function MiniBoard({ theme }: { theme: typeof THEMES[number] }) {
  return (
    <div className={`rounded p-1.5 ${theme.preview.bg}`}>
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-sm w-5 h-5 flex items-center justify-center ${theme.preview.cell}`}
          >
            {i === 4 && <span className={`w-2 h-2 rounded-sm ${theme.preview.dot}`} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GameplayPreferencesSection({ user, onUpdate }: GameplayPreferencesSectionProps) {
  const [prefs, setPrefs] = useState({
    notifications: user.preferences.notifications,
    soundEffects: user.preferences.soundEffects,
    theme: user.preferences.theme as BoardTheme,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrefs({
      notifications: user.preferences.notifications,
      soundEffects: user.preferences.soundEffects,
      theme: user.preferences.theme as BoardTheme,
    });
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload: UpdateProfilePayload = { preferences: prefs };
      const updatedUser = await updateProfile(payload);
      onUpdate(updatedUser);
      setSuccessMessage('Preferences saved');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty =
    prefs.notifications !== user.preferences.notifications ||
    prefs.soundEffects !== user.preferences.soundEffects ||
    prefs.theme !== user.preferences.theme;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006948" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        <h3 className="text-sm font-semibold text-gray-900">Gameplay Preferences</h3>
      </div>

      <div className="px-6 py-5 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">{successMessage}</div>
        )}

        {/* Board theme picker */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Default Board Theme</p>
          <div className="flex flex-col gap-2">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setPrefs({ ...prefs, theme: t.value })}
                className={`flex items-center gap-4 p-3 border-2 rounded-lg text-left transition-all ${
                  prefs.theme === t.value
                    ? 'border-[#006948] bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <MiniBoard theme={t} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${prefs.theme === t.value ? 'text-[#006948]' : 'text-gray-800'}`}>
                    {t.label}
                  </p>
                  <p className="text-xs text-gray-500">{t.description}</p>
                </div>
                {prefs.theme === t.value && (
                  <div className="w-5 h-5 bg-[#006948] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notifications &amp; Sound</p>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">Notifications</p>
              <p className="text-xs text-gray-500">Game invites and match updates</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.notifications}
              onClick={() => setPrefs({ ...prefs, notifications: !prefs.notifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                prefs.notifications ? 'bg-[#006948]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  prefs.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">Sound Effects</p>
              <p className="text-xs text-gray-500">In-game sounds and move feedback</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.soundEffects}
              onClick={() => setPrefs({ ...prefs, soundEffects: !prefs.soundEffects })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                prefs.soundEffects ? 'bg-[#006948]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  prefs.soundEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {isDirty && !isSaving && (
            <span className="text-xs text-amber-600">Unsaved changes</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#006948] text-white text-sm rounded-lg hover:bg-[#005237] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}