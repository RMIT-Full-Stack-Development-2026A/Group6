import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View your user profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
