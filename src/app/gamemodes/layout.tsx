import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamemodes",
  description: "Select your gamemode",
};

export default function GamemodesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
