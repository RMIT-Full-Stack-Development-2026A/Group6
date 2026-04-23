"use client";

import React, { useEffect, useState } from 'react';
import { User, Subscription, getProfile, getUserById, getSubscription } from '@/services/userService';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import EditInfoSection from '@/components/profile/EditInfoSection';
import GameplayPreferencesSection from '@/components/profile/GameplayPreferencesSection';
import GameHistorySection from '@/components/profile/GameHistorySection';
import SecuritySection from '@/components/profile/SecuritySection';
import SubscriptionSection from '@/components/profile/SubscriptionSection';

interface ProfilePageProps {
  userId?: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'history' | 'security' | 'subscription'>('profile');

  const isOwnProfile = !userId;

  useEffect(() => { loadUserData(); }, [userId]);

  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = isOwnProfile ? await getProfile() : await getUserById(userId!);
      setUser(userData);
      if (userData.currentSubscription) {
        try {
          const subData = await getSubscription(userData.currentSubscription);
          setSubscription(subData);
        } catch {}
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser: User) => setUser(updatedUser);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#006948] border-t-transparent"></div>
          <p className="mt-3 text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-500 mb-6 text-sm">{error || 'Profile not found'}</p>
          <a href="/" className="inline-block px-5 py-2.5 bg-[#006948] text-white rounded-lg text-sm hover:bg-[#005237] transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            {/* Green left accent bar */}
            <div className="w-1 h-10 bg-[#006948] rounded-full"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isOwnProfile ? 'Account Settings' : `${user.username}'s Profile`}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isOwnProfile ? 'Manage your architectural gaming identity and preferences.' : 'View player statistics and game history.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              user={user}
              subscription={subscription}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-4">
            {isOwnProfile ? (
              <>
                {activeSection === 'profile' && (
                  <>
                    {/* Edit Info + Gameplay Preferences side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EditInfoSection user={user} onUpdate={handleUserUpdate} />
                      <GameplayPreferencesSection user={user} onUpdate={handleUserUpdate} />
                    </div>

                    {/* Account Security below, full width */}
                    <SecuritySection />

                    {/* Discard / Save buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Discard Changes
                      </button>
                      <button
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#006948] text-white text-sm rounded-lg hover:bg-[#005237] transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  </>
                )}

                {activeSection === 'history' && <GameHistorySection isOwnProfile={true} />}
                {activeSection === 'security' && <SecuritySection />}
                {activeSection === 'subscription' && <SubscriptionSection subscriptionId={user.currentSubscription} />}
              </>
            ) : (
              <GameHistorySection userId={userId} isOwnProfile={false} />
            )}
          </div>
        </div>
      </div>

     
    </div>
  );
}