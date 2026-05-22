import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terms of Service | TicTacToang",
  description: "Terms of Service for TicTacToang",
};

export default function ToSLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}