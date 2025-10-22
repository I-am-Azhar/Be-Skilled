import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SiteNavbarServer from "@/components/site-navbar-server";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeSkilled",
  description: "Community-powered courses with WhatsApp integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen w-full bg-white dark:bg-black relative overflow-hidden">
            {/* Light theme: grid + quad glow */}
            <div
              className="absolute inset-0 z-0 pointer-events-none dark:hidden"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                  linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
                  radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
                  radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent),
                  radial-gradient(circle 600px at 50% 0px, #d5c5ff, transparent),
                  radial-gradient(circle 600px at 50% 100%, #d5c5ff, transparent)
                `,
                backgroundSize: `
                  96px 64px,
                  96px 64px,
                  100% 100%,
                  100% 100%,
                  100% 100%,
                  100% 100%
                `,
              }}
            />
            {/* Dark theme: subtle grid + violet glows */}
            <div
              className="absolute inset-0 z-0 pointer-events-none hidden dark:block"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px),
                  radial-gradient(circle 600px at 0% 200px, rgba(139,92,246,0.35), transparent),
                  radial-gradient(circle 600px at 100% 200px, rgba(139,92,246,0.35), transparent),
                  radial-gradient(circle 600px at 50% 0px, rgba(139,92,246,0.35), transparent),
                  radial-gradient(circle 600px at 50% 100%, rgba(139,92,246,0.35), transparent)
                `,
                backgroundSize: `
                  96px 64px,
                  96px 64px,
                  100% 100%,
                  100% 100%,
                  100% 100%,
                  100% 100%
                `,
              }}
            />

            <div className="relative z-10">
              <SiteNavbarServer />
              {children}
              <SiteFooter />
              <Toaster richColors position="top-right" />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
