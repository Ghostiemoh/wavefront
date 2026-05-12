import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wavefront — See the Narrative Before the Market Does",
  description:
    "AI-native onchain narrative intelligence powered by Birdeye. Real-time narrative detection, risk scoring, and agentic intelligence for Solana traders.",
  keywords: [
    "Solana",
    "onchain intelligence",
    "narrative detection",
    "Birdeye",
    "AI trading",
    "risk scoring",
    "DeFi",
    "crypto analytics",
  ],
  openGraph: {
    title: "Wavefront — See the Narrative Before the Market Does",
    description:
      "Real-time onchain narrative intelligence powered by Birdeye for traders and AI agents.",
    siteName: "Wavefront",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wavefront — See the Narrative Before the Market Does",
    description:
      "Real-time onchain narrative intelligence powered by Birdeye.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
