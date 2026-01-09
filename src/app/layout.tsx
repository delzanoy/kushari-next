import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@cryptofonts/cryptofont/cryptofont.css";
import DataPreloader from "../app/components/DataPreloader";
import ResponsiveLayout from '@/app/components/ResponsiveLayout';
import MobileView from '@/app/components/MobileView';
import SideNav from "./components/SideNav";
import WalletDataPreloader from "./components/WalletDataPreloader";
import { GoogleAnalytics } from '@next/third-parties/google';

import ModalHost from "./components/modal/ModalHost";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const figtreeSans = Figtree({
  variable: "--font-figtree-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kushari",
  description: "Web3 for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${figtreeSans.variable} ${geistMono.variable} antialiased h-[100vh] relative`}
      >
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string} />
        <ResponsiveLayout
          mobileLayout={<MobileView />}
          desktopLayout={<ModalHost>
            <DataPreloader />
            <WalletDataPreloader />
            <div className="flex min-h-screen bg-[#0E1011]">
              <div id="modal-root" />
              <SideNav />
              <main className="flex-1 pb-[256px] h-[100vh] overflow-auto">{children}</main>
            </div>
            <div className="group/credit absolute right-[16px] bottom-[16px] opacity-50 hover:opacity-100 cursor-pointer transition-opacity duration-200">
              <span className="line-clamp-1 overflow-hidden text-[#F8FCFF] text-ellipsis font-[figtreeSans] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">
                Product, design & development by <span className="font-bold">Delanoy Kunil</span>
              </span>
            </div>
          </ModalHost>}
        />

      </body>
    </html>
  );
}
