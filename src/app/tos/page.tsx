import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <main className="max-w-3xl mx-auto w-full py-32 px-8">
        <h1 className="text-5xl font-bold text-black mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing or using TicTacToang, you agree to be bound by these Terms of
            Service. If you do not agree, please discontinue use of the platform immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">2. User Accounts</h2>
          <p className="text-gray-600">
            You are responsible for maintaining the confidentiality of your account
            credentials. You agree not to share your account or use another user&apos;s account
            without permission. We reserve the right to suspend accounts that violate
            these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">3. Subscriptions & Payments</h2>
          <p className="text-gray-600">
            Premium features are available via paid subscription processed through Stripe.
            All charges are non-refundable unless required by applicable law. You may cancel
            your subscription at any time; access continues until the end of the billing period.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">4. Acceptable Use</h2>
          <p className="text-gray-600">
            You agree not to cheat, exploit bugs, harass other players, or attempt to
            reverse-engineer or compromise the platform. Violations may result in
            immediate account suspension without refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">5. Intellectual Property</h2>
          <p className="text-gray-600">
            All content, code, and assets on TicTacToang are the property of RMIT
            Fullstack Group 6 unless otherwise stated. You may not reproduce or
            distribute any part of the platform without written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">6. Limitation of Liability</h2>
          <p className="text-gray-600">
            TicTacToang is provided as-is for educational purposes. We make no warranties
            regarding uptime or data preservation. To the extent permitted by law, we are
            not liable for any damages arising from use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">7. Changes to Terms</h2>
          <p className="text-gray-600">
            We may update these terms at any time. Continued use of TicTacToang after
            changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>
      </main>
    </div>
  );
}