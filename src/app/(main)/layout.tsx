import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import "@cryptofonts/cryptofont/cryptofont.css";
import { SideNav } from "@/components/molecules/SideNav";
import { OnboardingShell } from "@/components/molecules/OnboardingShell";
import { SWRProvider } from "@/lib/swr-provider";
import { DemoModeProvider } from "@/lib/demo-mode";
import { OnboardingProvider } from "@/lib/onboarding";
import { ModalProvider } from "@/components/molecules/modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const generalSans = localFont({
  src: "../fonts/GeneralSansVF.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kushari",
  description: "Web3 for teams.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-black text-[#ededed]" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${generalSans.variable} ${geistMono.variable} antialiased h-full selection:bg-cyan-500/30 w-full`}
        suppressHydrationWarning
      >
        <SWRProvider>
          <DemoModeProvider>
            <OnboardingProvider>
              <OnboardingShell>
                <SideNav />
                <main className="flex-1 h-full overflow-auto">
                  <ModalProvider>
                    {children}
                  </ModalProvider>
                </main>
              </OnboardingShell>
            </OnboardingProvider>
          </DemoModeProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
