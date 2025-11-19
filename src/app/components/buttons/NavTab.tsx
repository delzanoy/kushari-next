// components/buttons/NavTab.tsx
"use client"

import { StatusDotIcon } from "../icons";
import { useRef, useEffect, useState } from "react";

interface SubTitleItem {
  name: string;
  count?: string | number;
  color?: string;
}

interface NavTabProps {
  title: string;
  titleCount?: string | number;
  titleColor?: string;
  subtitles: SubTitleItem[];
  isActive?: boolean;
  activeSubtitle?: string | null;
  onClick?: () => void;
  onSubtitleClick?: (subtitleName: string) => void;
}

const colorClasses = {
  "white": "text-[#F8FCFF]",
  "cyan": "text-[#26C9C9]", 
  "red": "text-[#ED090D]",
};

export default function NavTab({ 
  title, 
  titleCount, 
  titleColor, 
  subtitles, 
  isActive = false,
  activeSubtitle = null,
  onClick,
  onSubtitleClick
}: NavTabProps) {
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gradientPosition, setGradientPosition] = useState({ left: 0, width: 0 });
  
  // Initialize refs array
  useEffect(() => {
    subtitleRefs.current = subtitleRefs.current.slice(0, subtitles.length);
  }, [subtitles.length]);

  // Determine if any subtitle is active
  const hasActiveSubtitle = activeSubtitle !== null;
  
  // Update gradient position when active subtitle changes
  useEffect(() => {
    if (!isActive) return;

    // If there are no subtitles, use full width gradient
    if (subtitles.length === 0) {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setGradientPosition({
          left: 0,
          width: containerWidth
        });
      }
      return;
    }

    // If there are subtitles but none are active, also use full width gradient
    if (!activeSubtitle) {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setGradientPosition({
          left: 0,
          width: containerWidth
        });
      }
      return;
    }

    // If there's an active subtitle, position gradient under it
    const activeIndex = subtitles.findIndex(sub => sub.name === activeSubtitle);
    if (activeIndex !== -1 && subtitleRefs.current[activeIndex]) {
      const element = subtitleRefs.current[activeIndex];
      if (element) {
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setGradientPosition({
            left: rect.left - parentRect.left,
            width: rect.width
          });
        }
      }
    }
  }, [isActive, activeSubtitle, subtitles]);

  // Determine main title opacity
  const getTitleOpacity = () => {
    if (!isActive) return 'opacity-50';
    return hasActiveSubtitle ? 'opacity-50' : 'opacity-100';
  };

  // Determine subtitle opacity
  const getSubtitleOpacity = (subtitleName: string) => {
    if (!isActive) return 'opacity-50';
    return activeSubtitle === subtitleName ? 'opacity-100' : 'opacity-50';
  };

  const handleSubtitleClick = (e: React.MouseEvent, subtitleName: string) => {
    e.stopPropagation(); // Prevent triggering the main tab click
    onSubtitleClick?.(subtitleName);
  };

  const handleSubtitleKeyDown = (e: React.KeyboardEvent, subtitleName: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onSubtitleClick?.(subtitleName);
    }
  };

  // Proper ref callback function that doesn't return a value
  const setSubtitleRef = (index: number) => (el: HTMLDivElement | null) => {
    subtitleRefs.current[index] = el;
  };

  return (
    <div 
      ref={containerRef}
      className={`group relative flex py-[8px] px-[8px] h-full flex-col items-center justify-center cursor-pointer transition-colors ${
        isActive ? "" : "hover:border-[#F8FCFF]/40"
      }`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Gradient border for active tab */}
      {isActive && (
        <div 
          className="absolute bottom-0 h-[0.8px] transition-all duration-300 ease-in-out"
          style={{
            left: `${gradientPosition.left}px`,
            width: `${gradientPosition.width}px`,
            background: 'linear-gradient(90deg, #1F2122 0%, #26C9C9 50%, #1F2122 100%)'
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Title Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-baseline gap-1">
          <span className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[1.12px] transition-opacity duration-200 ${
            isActive && !hasActiveSubtitle 
              ? 'opacity-100' 
              : 'opacity-50 group-hover:opacity-80'
          }`}>
            {title}
          </span>
          <span className="text-[#A6FCFC] font-[Geist] text-[10px] not-italic font-medium leading-[15px] tracking-[0.38px] uppercase">
            {titleCount}
          </span>
        </div>
        {/* Status dot for main title */}
        {titleColor && (
          <div className="relative h-[18px] w-[18px]">
            <StatusDotIcon className={`absolute left-0 top-0 h-[18px] w-[18px] ${colorClasses[titleColor as keyof typeof colorClasses]}`} />
            <StatusDotIcon className={`absolute left-0 top-0 h-[18px] w-[18px] animate-ping ${colorClasses[titleColor as keyof typeof colorClasses]}`} />
          </div>
        )}
      </div>

      {/* Subtitles Section - Only renders if there are subtitles */}
      {subtitles.length > 0 && (
        <div className="flex items-start gap-5 mt-2">
          {subtitles.map((subtitle, index) => (
            <div 
              key={index}
              ref={setSubtitleRef(index)}
              className="group/subtitle flex items-center gap-2 cursor-pointer"
              onClick={(e) => handleSubtitleClick(e, subtitle.name)}
              onKeyDown={(e) => handleSubtitleKeyDown(e, subtitle.name)}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${subtitle.name}`}
            >
              <div className="flex items-baseline gap-1">
                <span className={`text-[#F8FCFF] font-[Geist] text-xs not-italic font-normal leading-[normal] tracking-[0.96px] transition-opacity duration-200 ${
                  isActive && activeSubtitle === subtitle.name
                    ? 'opacity-100'
                    : 'opacity-50 group-hover/subtitle:opacity-80'
                }`}>
                  {subtitle.name}
                </span>
                <span className="text-[#A6FCFC] font-[Geist] text-[10px] not-italic font-medium leading-[15px] tracking-[0.38px] uppercase">
                  {subtitle.count}
                </span>
              </div>
              {/* Status dot for subtitle */}
              {subtitle.color && (
                <div className="relative h-[18px] w-[18px]">
                  <StatusDotIcon className={`absolute left-0 top-0 h-[18px] w-[18px] ${colorClasses[subtitle.color as keyof typeof colorClasses]}`} />
                  <StatusDotIcon className={`absolute left-0 top-0 h-[18px] w-[18px] animate-ping ${colorClasses[subtitle.color as keyof typeof colorClasses]}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}