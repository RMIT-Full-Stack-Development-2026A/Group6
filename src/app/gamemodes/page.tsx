"use client"

import React from "react"
import MatchType from "@/components/ui/MatchType"
import DraftGrid from "@/components/ui/DraftGrid"
import SelectedConfig from "@/components/ui/SelectedConfig"
import { SelectionProvider } from "@/context/selection"

export default function GamemodesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="min-h-screen w-full py-24 px-16 bg-white">
        <SelectionProvider>

          <div className="text-black text-7xl w-full mb-8">
            Select your <span className="text-[#006948]">Environment</span>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MatchType type="online" />
            <MatchType type="bot" />
            <MatchType type="local" />
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-10">
            <DraftGrid size={10} subtitle="Standard" />
            <DraftGrid size={15} subtitle="Large" />
            <DraftGrid size={20} subtitle="Epic" />
          </div>

          
          <div className="sticky bottom-6 mt-4">
            <SelectedConfig />
          </div>

        </SelectionProvider>
      </main>
    </div>
  )
}