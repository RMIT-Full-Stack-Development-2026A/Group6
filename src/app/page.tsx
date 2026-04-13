import PlayBox from "@/components/ui/PlayBox";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full  flex-col items-center justify-between py-32 px-16 bg-white  sm:items-start">
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
