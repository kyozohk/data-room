import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.scss";

import { ThemeProvider } from "../context/ThemeContext";
import FixedFooter from "../components/landing/FixedFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kyozo · Discover Your Creative Universe",
  description: "Kyozo is an ecosystem of creative communities — exclusive access, insider insights, and tools to grow your audience.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <FixedFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
