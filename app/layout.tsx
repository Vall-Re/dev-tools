import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Header from "@/components/Header";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7938500556034307"
          crossOrigin="anonymous"
        >
        </script>
      </head>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="mt-auto py-6 border-t border-gray-800 text-center text-sm text-gray-400 bg-gray-900/60">
          <div className="space-x-4 mb-2">
            <Link href="https://100devtoolshub.com/about" className="hover:underline hover:text-gray-200">
              About Us
            </Link>
            <span>•</span>
            <Link href="https://100devtoolshub.com/privacy" className="hover:underline hover:text-gray-200">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="https://100devtoolshub.com/terms" className="hover:underline hover:text-gray-200">
              Terms of Service
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} 100 DevTools Hub. All rights reserved.</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}