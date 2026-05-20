import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match",
  description: "Match in progress",
};

export default function PlayfieldLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
