import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../../globals.css";
import "@cryptofonts/cryptofont/cryptofont.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const generalSans = localFont({
  src: "../../fonts/GeneralSansVF.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design Tokens — Token v2",
  description: "Layer 1 design token documentation.",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#0A0A0A] text-[#ededed]" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${generalSans.variable} ${geistMono.variable} antialiased h-full w-full`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
