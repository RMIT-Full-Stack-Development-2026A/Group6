import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}