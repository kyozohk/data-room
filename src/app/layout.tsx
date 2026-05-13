import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";

import { ThemeProvider } from "../context/ThemeContext";
import FixedFooter from "../components/landing/FixedFooter";

/**
 * Inter — the typeface used across the KyozoVerse brand. Loaded once
 * here and exposed via the `--font-inter` CSS variable, which the SCSS
 * tokens in `_theme-variables.scss` / `globals.scss` pick up.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kyozo · Discover Your Creative Universe",
  description:
    "Kyozo is an ecosystem of creative communities — exclusive access, insider insights, and tools to grow your audience.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
          <FixedFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
