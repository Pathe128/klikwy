import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/app/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";
import { headers } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "klikwy",
  description: "my klikwy app",  
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="fr" className="h-full bg-gray-50">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers session={session}>
          <div className="flex-1">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
