"use client";

import { LanguageProvider } from '@/lib/language-context';
import { ContractProvider } from '@/lib/contract-context';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className={`${inter.variable} ${cairo.variable}`}>
        <LanguageProvider>
          <ContractProvider>
            {children}
          </ContractProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
