// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext"; // 引入 Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mycelium | Gemini 3 Hackathon",
  description: "Decentralized Disaster Resilience Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
