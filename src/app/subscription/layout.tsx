import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription",
  description: "Manage your subscription",
};

export default function SubscriptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
