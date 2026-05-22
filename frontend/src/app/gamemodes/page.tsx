import React from "react";
import MatchType from "@/components/ui/MatchType";
import DraftGrid from "@/components/ui/DraftGrid";
import SelectedConfig from "@/components/ui/SelectedConfig";
import { SelectionProvider } from "@/context/selection";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen w-full justify-between py-16 sm:py-32 px-6 sm:px-16 bg-white sm:items-start">
        <SelectionProvider>
          <div className="text-black text-4xl sm:text-7xl w-full">
            Select your <span className="text-[#006948]">Environment</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <MatchType type="online" />
            <MatchType type="bot" />
            <MatchType type="local" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 py-10">
            <DraftGrid size={10} subtitle="Standard Session" />
            <DraftGrid size={15} subtitle="Large Session" />
          </div>
          <div className="py-4">
            <SelectedConfig />
          </div>
        </SelectionProvider>
      </main>
    </div>
  );
}