import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/app/providers";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body className="antialiased pb-16" data-atm-ext-installed="1.29.12" cz-shortcut-listen="true"
>
<Providers>
          <Header />
          <main className="pb-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
