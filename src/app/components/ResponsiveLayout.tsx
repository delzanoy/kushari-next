// app/components/ResponsiveLayout.tsx
"use client";

import { ReactNode } from 'react';
import { useDeviceType } from '@/app/hooks/useDeviceType';
import SideNav from './SideNav';
import MobileView from './MobileView'; // You'll create this

interface ResponsiveLayoutProps {
  children?: ReactNode; // Make children optional
  mobileLayout?: ReactNode;
  desktopLayout?: ReactNode;
}

/**
 * ResponsiveLayout - Wraps content and shows different layouts based on device
 * 
 * Usage Option 1: Different navigation for mobile/desktop
 * <ResponsiveLayout>{children}</ResponsiveLayout>
 * 
 * Usage Option 2: Completely different layouts
 * <ResponsiveLayout 
 *   mobileLayout={<MobileContent />}
 *   desktopLayout={<DesktopContent />}
 * />
 */
export default function ResponsiveLayout({ 
  children, 
  mobileLayout, 
  desktopLayout 
}: ResponsiveLayoutProps) {
  const { isMobile, isDesktop } = useDeviceType();

  // If custom layouts are provided, use them
  if (mobileLayout && desktopLayout) {
    return isMobile ? <>{mobileLayout}</> : <>{desktopLayout}</>;
  }

  // Default behavior: Different navigation for mobile/desktop
  return (
    <div className="flex min-h-screen bg-[#0E1011]">
      {/* Desktop: Show SideNav */}
      {/* {isDesktop && <SideNav />} */}
      
      {/* Mobile: Show MobileNav (you can create this component) */}
      {isMobile && <MobileView />}
      
      {/* Main content area */}
      {/* <main className={`flex-1 pb-[256px] h-[100vh] overflow-auto ${isMobile ? 'pt-16' : ''}`}>
        {children}
      </main> */}

      {/* Credit footer - adjust position for mobile */}
      <div className={`group/credit absolute ${isMobile ? 'left-[16px]' : 'right-[16px]'} bottom-[16px] opacity-50 hover:opacity-100 cursor-pointer transition-opacity duration-200`}>
        <span className="line-clamp-1 overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">
          Product, design & development by <span className="font-bold">Delanoy Kunil</span>
        </span>
      </div>
    </div>
  );
}