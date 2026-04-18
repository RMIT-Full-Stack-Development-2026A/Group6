"use client";

import React, { useState } from 'react';
import { User, UpdateProfilePayload, updateProfile } from '@/services/userService';

interface EditInfoSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function EditInfoSection({ user, onUpdate }: EditInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    country: user.profile.country,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload: UpdateProfilePayload = {
        username: formData.username,
        profile: {
          country: formData.country,
        },
      };

      const updatedUser = await updateProfile(payload);
      onUpdate(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      country: user.profile.country,
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[#006948]">✏️</span>
        <h3 className="text-lg font-semibold text-gray-900">Edit Info</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              USERNAME
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006948] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Elias Jensen"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="elias.j@architect.design"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COUNTRY
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006948] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">Select Country</option>
              <option value="Denmark">Denmark</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="Vietnam">Vietnam</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#006948] text-white rounded-lg hover:bg-[#005237] transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 bg-[#006948] text-white rounded-lg hover:bg-[#005237] transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}