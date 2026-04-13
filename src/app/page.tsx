import PlayBox from "@/components/ui/PlayBox";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full justify-between py-32 px-16 bg-white  sm:items-start ">
          <div className={"text-black"}>
              <div className={"text-7xl font-bold w-100"}>Ultimate Tic Tac Toe</div>
              <div className={"text-xl w-150 py-5"}>Experience the architectural evolution of a classic. Choose
                  between Standard, Blitz, or Infinite modes. A curated digital gallery
                  where strategy meets absolute minimalism.</div>
          </div>
        <div className={"grid grid-cols-3 gap-4"}>
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
