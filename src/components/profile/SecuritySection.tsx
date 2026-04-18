"use client";

import React, { useState } from 'react';
import { updatePassword } from '@/services/userService';

export default function SecuritySection() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);

    try {
      await updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage('Password updated successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setIsChangingPassword(false);
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[#006948]">🔒</span>
          <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Keep your architectural vault secure.
      </p>

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

      {!isChangingPassword ? (
        <button
          onClick={() => setIsChangingPassword(true)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>🔑</span>
          <span>Change Password</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006948] focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006948] focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006948] focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-[#006948] text-white rounded-lg hover:bg-[#005237] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}