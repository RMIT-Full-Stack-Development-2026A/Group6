"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Subscription, getSubscription } from '@/services/userService';

interface SubscriptionSectionProps {
  subscriptionId: string | null;
}

export default function SubscriptionSection({ subscriptionId }: SubscriptionSectionProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subscriptionId) {
      loadSubscription();
    } else {
      setIsLoading(false);
    }
  }, [subscriptionId]);

  const loadSubscription = async () => {
    if (!subscriptionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getSubscription(subscriptionId);
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading subscription details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const isPremium = subscription?.name === 'Premium';

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h3>
        
        <div className={`border-2 rounded-lg p-6 ${
          isPremium ? 'border-[#006948] bg-[#E8F5F1]' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                {subscription?.name || 'Free'} Plan
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {subscription?.description || 'Basic access to TicTacToang'}
              </p>
            </div>
            {isPremium && (
              <div className="bg-[#006948] text-white px-4 py-2 rounded-full text-sm font-semibold">
                ACTIVE
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${subscription?.price || 0}
                  <span className="text-sm font-normal text-gray-600">
                    /{subscription?.duration.value} {subscription?.duration.unit}
                    {(subscription?.duration.value || 0) > 1 ? 's' : ''}
                  </span>
                </p>
              </div>
              {isPremium && (
                <div>
                  <p className="text-sm text-gray-600">Next Billing Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Features:</p>
              <ul className="space-y-2">
                {subscription?.features.multiplayerAccess && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-[#006948]">✓</span>
                    <span>Unlimited multiplayer access</span>
                  </li>
                )}
                {subscription?.features.adFree && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-[#006948]">✓</span>
                    <span>Ad-free experience</span>
                  </li>
                )}
                {subscription?.features.customThemes && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-[#006948]">✓</span>
                    <span>Custom themes</span>
                  </li>
                )}
                {subscription?.features.cloudSave && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-[#006948]">✓</span>
                    <span>Cloud save</span>
                  </li>
                )}
                {subscription?.features.premiumSupport && (
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-[#006948]">✓</span>
                    <span>Priority support</span>
                  </li>
                )}
                {!isPremium && (
                  <>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-[#006948]">✓</span>
                      <span>Basic game modes</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-[#006948]">✓</span>
                      <span>Limited daily games</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {isPremium ? (
              <>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Change Plan
                </button>
                <button className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Cancel Subscription
                </button>
              </>
            ) : (
              <Link href="/subscription" className="w-full">
                <button className="w-full px-4 py-2 bg-[#006948] text-white rounded-lg hover:bg-[#005237] transition-colors">
                  Upgrade to Premium
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Billing History */}
      {isPremium && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">Premium Subscription</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${subscription?.price}.00</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Paid</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgrade Benefits (for Free users) */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-[#006948] to-[#004830] rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
          <p className="text-sm mb-4 opacity-90">
            Unlock the full potential of TicTacToang with our Premium plan
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span className="text-sm">Unlimited online matches</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span className="text-sm">Ad-free experience</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span className="text-sm">Custom themes & boards</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span className="text-sm">Priority matchmaking</span>
            </div>
          </div>

          <Link href="/subscription" className="w-full">
            <button className="w-full bg-white text-[#006948] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}