import React from "react";
import MatchType from "@/components/ui/MatchType";
import DraftGrid from "@/components/ui/DraftGrid";
import { SelectionProvider } from "@/context/selection";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen w-full justify-between py-32 px-16 bg-white  sm:items-start">
        <SelectionProvider>
          <div className={"text-black text-7xl w-full"}>Select your <span className={"text-[#006948]"}>Enviroment</span></div>
          <div className={"grid grid-cols-1 md:grid-cols-3 gap-4"}>
              <MatchType type={"online"} />
              <MatchType type={"bot"} />
              <MatchType type={"local"} />
          </div>
          <div className={"grid grid-cols-1 md:grid-cols-3 gap-4 py-10"}>
              <DraftGrid size={3} subtitle={"Quick Session"}/>
              <DraftGrid size={5} subtitle={"Quick Session"}/>
              <DraftGrid size={10} subtitle={"Quick Session"}/>
          </div>
        </SelectionProvider>
      </main>
    </div>
  );
}
