import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { I18nProvider } from "@/i18n";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoHousing - Vind Je Perfecte Match",
  description: "AI-aangedreven cohousing platform dat verhuurders en huurders matcht op basis van levensstijlcompatibiliteit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <AppProvider>
            <Header />
            {children}
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
