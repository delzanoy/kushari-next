// app/hooks/usePlatform.ts
"use client";

import { useState, useEffect } from 'react';

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  platform: 'ios' | 'android' | 'desktop';
  isStandalone: boolean; // For PWA check
}

// Extend the Navigator interface to include the standalone property
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function usePlatform(): PlatformInfo {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    platform: 'desktop',
    isStandalone: false
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    const isIOS = 
      /iphone|ipad|ipod/.test(platform) ||
      /iphone|ipad|ipod/.test(userAgent) ||
      (platform === 'macintel' && 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 1);
    
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
    
    // Type cast navigator to our extended interface
    const nav = navigator as NavigatorWithStandalone;
    
    // Check if PWA is installed (iOS specific)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
      ('standalone' in nav && nav.standalone) ||
      document.referrer.includes('android-app://');

    setPlatformInfo({
      isIOS,
      isAndroid,
      isMobile,
      platform: isIOS ? 'ios' : isAndroid ? 'android' : 'desktop',
      isStandalone
    });
  }, []);

  return platformInfo;
}