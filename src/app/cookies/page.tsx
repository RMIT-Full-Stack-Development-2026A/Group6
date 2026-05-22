import React from "react";

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <main className="max-w-3xl mx-auto w-full py-32 px-8">
        <h1 className="text-5xl font-bold text-black mb-2">Cookie Settings</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">What Are Cookies?</h2>
          <p className="text-gray-600">
            Cookies are small text files stored on your device when you visit TicTacToang.
            They help us keep you logged in, remember your preferences, and understand
            how the site is used.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">Cookies We Use</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-black">Strictly Necessary</h3>
              <p className="text-gray-600 text-sm mt-1">
                Required for core functionality such as authentication tokens and session
                management. These cannot be disabled.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-black">Functional</h3>
              <p className="text-gray-600 text-sm mt-1">
                Used to remember your preferences such as theme and game settings across
                sessions.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-black">Analytics</h3>
              <p className="text-gray-600 text-sm mt-1">
                Help us understand how players interact with the site so we can improve
                the experience. No personally identifiable information is collected.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">Managing Cookies</h2>
          <p className="text-gray-600">
            You can control or delete cookies through your browser settings at any time.
            Note that disabling strictly necessary cookies may prevent you from logging in
            or using core features of TicTacToang.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">Contact</h2>
          <p className="text-gray-600">
            For questions about our cookie practices, please contact the RMIT Fullstack
            Group 6 team via your course channels.
          </p>
        </section>
      </main>
    </div>
  );
}