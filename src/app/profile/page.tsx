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
  userId?: string; // If provided, viewing another user's profile
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'history' | 'security' | 'subscription'>('profile');

  const isOwnProfile = !userId; // If no userId is provided, it's the current user's profile

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user data
      const userData = isOwnProfile ? await getProfile() : await getUserById(userId!);
      setUser(userData);

      // Fetch subscription if user has one
      if (userData.currentSubscription) {
        try {
          const subData = await getSubscription(userData.currentSubscription);
          setSubscription(subData);
        } catch (subErr) {
          console.error('Failed to load subscription:', subErr);
          // Don't fail the whole page if subscription fails
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#006948] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#006948] text-white rounded-lg hover:bg-[#005237] transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isOwnProfile ? 'Account Settings' : `${user.username}'s Profile`}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isOwnProfile 
              ? 'Manage your architectural gaming identity and preferences.' 
              : 'View player statistics and game history.'}
          </p>
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

          {/* Content Area */}
          <div className="lg:col-span-3">
            {isOwnProfile ? (
              <>
                {activeSection === 'profile' && (
                  <div className="space-y-6">
                    <EditInfoSection user={user} onUpdate={handleUserUpdate} />
                    <GameplayPreferencesSection user={user} onUpdate={handleUserUpdate} />
                  </div>
                )}

                {activeSection === 'history' && (
                  <GameHistorySection isOwnProfile={true} />
                )}

                {activeSection === 'security' && (
                  <SecuritySection />
                )}

                {activeSection === 'subscription' && (
                  <SubscriptionSection subscriptionId={user.currentSubscription} />
                )}
              </>
            ) : (
              // View-only mode for other players
              <GameHistorySection userId={userId} isOwnProfile={false} />
            )}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-xs text-gray-500 text-center">
          © 2024 TIC TAC TOANG. ARCHITECTURAL GAMING EXCELLENCE.
        </p>
      </div>
    </div>
  );
}