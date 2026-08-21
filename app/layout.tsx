import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Header from "@/components/Header";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "100 DevTools Hub | Free Client-Side Online Tools for Developers",
  description: "Fast, secure, client-side web tools for developers. Formatters, converters, generators, and encoders with zero server-side storage.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7938500556034307"
          crossOrigin="anonymous"
        >
        </script>
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="mt-auto border-t border-border bg-surface-900/60">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-6 py-6 text-sm text-text-secondary">
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            >
              <Link
                href="/about"
                className="transition-colors hover:text-text-primary"
              >
                About Us
              </Link>

              <Link
                href="/privacy"
                className="transition-colors hover:text-text-primary"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition-colors hover:text-text-primary"
              >
                Terms of Service
              </Link>
            </nav>

            <p>
              &copy; {new Date().getFullYear()} 100 DevTools Hub. All rights reserved.
            </p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}