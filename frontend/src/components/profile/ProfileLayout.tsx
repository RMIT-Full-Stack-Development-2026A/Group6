/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import ProfileSidebar from "@/components/profile/ProfileSidebar"
import EditInfoCard from "@/components/profile/EditInfoCard"
import GameplayPreferences from "@/components/profile/GameplayPreferences"
import AccountSecurity from "@/components/profile/AccountSecurity"
import SaveBar from "@/components/profile/SaveBar"
import GameHistory from "@/components/profile/GameHistory"

export default function ProfileLayout({}: { children?: React.ReactNode }) {
  const [active, setActive] = useState<'profile'|'history'|'security'|'subscription'>('profile')

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-8">
          {/* @ts-expect-error muting this*/}
          <ProfileSidebar active={active} onSelect={(t) => setActive(t as any)} />

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl text-black font-bold">Account Settings</h1>
              <p className="text-sm text-gray-500 mt-2">Manage your architectural gaming identity and preferences.</p>
            </div>

            {active === 'profile' && (
              <>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8">
                    <EditInfoCard />
                  </div>

                  <div className="col-span-4">
                    <GameplayPreferences />
                  </div>
                </div>

                <div className="mt-6">
                  <AccountSecurity />
                </div>

                <SaveBar />
              </>
            )}

            {active === 'history' && (
              <GameHistory />
            )}

            {active === 'security' && (
              <AccountSecurity />
            )}

            {active === 'subscription' && (
              <div className="bg-white rounded-md p-6 shadow-sm text-black">Still cooking</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
