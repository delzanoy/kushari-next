// app/components/MobileView.tsx
"use client";
import { usePlatform } from "../hooks/usePlatform";
import { ShareIcon } from "@/app/components/icons";
import PrimaryButton from "./buttons/PrimaryButton";
import BackgroundLightPillar from "./BackgroundLightPillar";
import { useState } from "react";

export default function MobileView() {
  const { isIOS, isAndroid } = usePlatform();
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const getPlatform = () => {
    if (isAndroid) return "android";
    if (isIOS) return "ios";
    // Default to iOS if platform detection fails
    return "ios";
  };

  const handleShare = async () => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;
    
    setIsSharing(true);
    
    try {
      // Create share data
      const shareData = {
        title: 'Desktop-First Product',
        text: 'Check out this product designed for desktop - best experienced on a larger screen!',
        url: window.location.href,
      };

      // Check if Web Share API is supported (mobile browsers)
      if (navigator.share && navigator.canShare?.(shareData)) {
        try {
          await navigator.share(shareData);
          setShareSuccess(true);
          
          // Reset success state after 3 seconds
          setTimeout(() => {
            setShareSuccess(false);
          }, 3000);
        } catch (error) {
          // User cancelled share or error occurred
          console.log('Share cancelled or failed:', error);
          // Fall back to copy link
          await copyToClipboard();
        }
      } else {
        // Fall back to copy link for unsupported browsers
        await copyToClipboard();
      }
    } catch (error) {
      console.error('Share error:', error);
      // Last resort fallback
      fallbackShare();
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setShareSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    // Show alert with link for very old browsers
    alert(`Share this link: ${window.location.href}`);
  };

  const getButtonState = () => {
    if (isSharing) {
      return {
        label: "Sharing...",
        disabled: true,
      };
    }
    
    if (shareSuccess) {
      return {
        label: "Link Copied!",
        disabled: false,
      };
    }
    
    return {
      label: "Share",
      disabled: false,
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="bg-[#0E1011] h-[100vh] w-[100vw] relative overflow-hidden">
      {/* Background - absolute positioned to cover full screen */}
      <div className="absolute inset-0">
        <BackgroundLightPillar />
      </div>
      
      {/* Content container with higher z-index */}
      <div className="flex w-full h-full pt-[262px] pr-[44px] pb-[190px] pl-[44px] flex-col justify-end items-start gap-8 relative z-10">
        {/* Desktop Icon with enhanced effects */}
        <div className="relative">
          {/* Glow effect behind the icon */}
          <div className="absolute inset-[-10px] bg-gradient-to-r from-[#E5F25A]/20 to-[#C5E7FF]/20 rounded-[20px] blur-[15px] mix-blend-overlay opacity-60 animate-pulse-slow" />
          
          {/* Icon with blend mode */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="82" 
            height="82" 
            viewBox="0 0 82 82" 
            fill="none"
            className="relative mix-blend-screen drop-shadow-[0_0_15px_rgba(229,242,90,0.3)]"
          >
            <path d="M47.8335 61.5V68.3333L54.6668 71.75V75.1667H27.3335L27.3212 71.7623L34.1668 68.3333V61.5H10.2221C8.35067 61.5 6.8335 59.9663 6.8335 58.0577V13.6922C6.8335 11.7912 8.38914 10.25 10.2221 10.25H71.7782C73.6498 10.25 75.1668 11.7838 75.1668 13.6922V58.0577C75.1668 59.9587 73.6112 61.5 71.7782 61.5H47.8335ZM13.6668 47.8333V54.6667H68.3335V47.8333H13.6668Z" fill="url(#paint0_linear_1231_129109)" />
            <defs>
              <linearGradient id="paint0_linear_1231_129109" x1="41.0002" y1="10.25" x2="41.0002" y2="75.1667" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.704762" stopColor="#B0B9E8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="flex flex-col items-start gap-2 self-stretch">
          <span className="text-[#F8FCFF] font-[Geist] text-[28px] not-italic font-semibold leading-[125%] self-stretch">Product designed for Desktop</span>
          <span className="text-[#F8FCFF] font-[Figtree] text-base not-italic font-light leading-[150%] self-stretch">Best judged on a larger screen</span>
        </div>
        

        
        <PrimaryButton
          size="lg"
          variant="inverted"
          label={buttonState.label}
          disabled={buttonState.disabled}
          leadingIcon={<ShareIcon platform={getPlatform()} />}
          onClick={handleShare}
        />
      
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}