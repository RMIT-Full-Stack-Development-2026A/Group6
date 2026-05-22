import React from "react";
import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2">
          Cookie <span className="text-[#006948]">Settings</span>
        </h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: May 2026</p>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">What are cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files placed on your device when you visit TicTacToang. They help us remember your preferences, keep you signed in, and understand how you use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">Cookies we use</h2>
          <div className="space-y-4">
            {[
              { name: "Essential Cookies", desc: "Required for the site to function. These include session authentication tokens and security cookies. They cannot be disabled." },
              { name: "Preference Cookies", desc: "Remember your settings such as game mode preferences and display options so you don't have to reconfigure them every visit." },
              { name: "Analytics Cookies", desc: "Help us understand how players interact with the game — which modes are most popular, where errors occur, and how to improve the experience." },
            ].map((item) => (
              <div key={item.name} className="border border-gray-100 rounded-lg p-5 shadow-sm">
                <div className="font-semibold text-black mb-1">{item.name}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">Managing cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            You can control or delete cookies through your browser settings at any time. Note that disabling essential cookies may prevent you from logging in or playing online matches.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Questions about our cookie use? See our{" "}
            <Link href="/privacy" className="text-[#006948] underline hover:text-[#005237]">Privacy Notice</Link>{" "}
            or{" "}
            <Link href="/tos" className="text-[#006948] underline hover:text-[#005237]">Terms of Service</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}