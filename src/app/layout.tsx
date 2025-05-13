import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dots Golf",
  description: "Track dots and team scores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-[#1ea97c] text-white font-sans ${inter.className}`}>
        <div className="min-h-screen flex items-center justify-center">{children}</div>
      </body>
    </html>
  );
}
