import PricingSection from "@/components/home/PricingSection";
import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen w-full justify-between py-16 sm:py-32 px-6 sm:px-16 bg-white sm:items-start">
        <div className="text-black text-4xl font-black">PRICING PLANS</div>
        <div className="text-xl sm:text-2xl text-black">Select the plan suits you the most</div>
        <PricingSection />
      </main>
    </div>
  );
}