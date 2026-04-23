import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Cube11 — AI video, made simple",
  description:
    "The friendliest AI video maker for Reels, Shorts, TikTok, and WhatsApp Status. Free preview, pay only when you love it.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Cube11",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
