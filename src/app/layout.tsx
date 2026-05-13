import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import 'highlight.js/styles/github.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: process.env.DATAROOM_NAME || 'Kyozo Dataroom',
  description: 'Confidential — Kyozo company dataroom',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
