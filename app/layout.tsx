import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7938500556034307"
          crossorigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <main className="flex-1">{children}</main>
        <footer className="mt-auto py-6 border-t border-gray-200 text-center text-sm text-gray-500 bg-white">
          <div className="space-x-4 mb-2">
            <Link href="/privacy" className="hover:underline hover:text-gray-700">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} 100 DevTools Hub. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}