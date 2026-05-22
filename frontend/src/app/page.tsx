import PlayBox from "@/components/ui/PlayBox";
import React from "react";
import AuthButtons from "@/components/ui/AuthButtons";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full justify-between py-32 px-6 sm:px-16 bg-white items-center flex-col lg:flex-row gap-12 lg:gap-0 lg:items-start">
        <div className="text-black w-full lg:w-auto">
          <div className="text-5xl lg:text-7xl font-bold lg:w-100">Ultimate Tic Tac Toe</div>
          <div className="text-xl lg:w-150 py-5">
            Experience the architectural evolution of a classic. Choose between Standard, Blitz, or
            Infinite modes. A curated digital gallery where strategy meets absolute minimalism.
          </div>
          <AuthButtons />
        </div>
        <div className="grid grid-cols-3 gap-4 flex-shrink-0">
          <PlayBox char="X" />
          <PlayBox char="" />
          <PlayBox char="O" />
          <PlayBox char="" />
          <PlayBox char="X" />
          <PlayBox char="" />
          <PlayBox char="" />
          <PlayBox char="O" />
          <PlayBox char="" />
        </div>
      </main>
    </div>
  );
}