import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription",
  description: "Choose a pricing plan and manage your subscription",
};

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}