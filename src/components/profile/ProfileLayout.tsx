"use client"

import React from "react"
import ProfileSidebar from "@/components/profile/ProfileSidebar"
import EditInfoCard from "@/components/profile/EditInfoCard"
import GameplayPreferences from "@/components/profile/GameplayPreferences"
import AccountSecurity from "@/components/profile/AccountSecurity"
import SaveBar from "@/components/profile/SaveBar"

export default function ProfileLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-8">
          <ProfileSidebar />

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl text-black font-bold">Account Settings</h1>
              <p className="text-sm text-gray-500 mt-2">Manage your architectural gaming identity and preferences.</p>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  )
}
