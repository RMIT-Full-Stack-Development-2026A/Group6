import React from "react";
import Link from "next/link";

export default function TosPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2">
          Terms of <span className="text-[#006948]">Service</span>
        </h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: May 2026</p>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using TicTacToang, you agree to be bound by these Terms of Service and our Privacy Notice. If you do not agree, please do not use the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">2. Account Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your account, use another person's account, or create accounts with false information. We reserve the right to suspend accounts that violate these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">3. Acceptable Use</h2>
          <p className="text-gray-700 leading-relaxed mb-3">You agree not to:</p>
          <ul className="space-y-2 text-gray-700 text-sm">
            {[
              "Exploit bugs or cheats to gain an unfair advantage in games",
              "Harass, abuse, or threaten other players",
              "Attempt to reverse-engineer or tamper with the platform",
              "Use automated bots or scripts outside of designated bot game modes",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="bg-[#006948] text-white rounded-full w-5 h-5 flex-shrink-0 flex items-center justify-center text-xs mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">4. Subscriptions & Payments</h2>
          <p className="text-gray-700 leading-relaxed">
            Premium subscriptions are billed monthly. You may cancel at any time; your access continues until the end of the current billing period. We do not offer refunds for partial months. Pricing may change with 30 days' notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">5. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All content, code, graphics, and trademarks on TicTacToang are owned by RMIT Fullstack Group 6 or its licensors. You may not reproduce or distribute any part of the platform without written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">6. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            TicTacToang is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">7. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions, see our{" "}
            <Link href="/privacy" className="text-[#006948] underline hover:text-[#005237]">Privacy Notice</Link>{" "}
            or{" "}
            <Link href="/cookies" className="text-[#006948] underline hover:text-[#005237]">Cookie Settings</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}