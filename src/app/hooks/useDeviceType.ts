// hooks/useDeviceType.ts
"use client";

import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  width: number;
}

// Breakpoints matching Tailwind defaults
const BREAKPOINTS = {
  mobile: 768,    // < 768px
  tablet: 1024,   // 768px - 1024px
  desktop: 1024   // >= 1024px
};

export function useDeviceType(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
    width: typeof window !== 'undefined' ? window.innerWidth : 1200
  });

  useEffect(() => {
    // Function to update device info
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      let deviceType: DeviceType;
      
      if (width < BREAKPOINTS.mobile) {
        deviceType = 'mobile';
      } else if (width < BREAKPOINTS.desktop) {
        deviceType = 'tablet';
      } else {
        deviceType = 'desktop';
      }

      setDeviceInfo({
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        deviceType,
        width
      });
    };

    // Initial call
    updateDeviceInfo();

    // Add event listener
    window.addEventListener('resize', updateDeviceInfo);

    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  return deviceInfo;
}

// Alternative hook for simple mobile detection
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkIsMobile();

    // Add listener
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}