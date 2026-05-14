import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kyozo · Discover Your Creative Universe",
  description:
    "Kyozo is an ecosystem of creative communities — exclusive access, insider insights, and tools to grow your audience.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
          <FixedFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
