import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  qrCode?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  subtitle,
  qrCode,
  position = 'top',
  className = '',
  open,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return {
          container: 'top-full left-1/2 -translate-x-1/2 mt-2.5',
          arrow: 'bottom-full left-1/2 -translate-x-1/2'
        };
      case 'left':
        return {
          container: 'right-full top-1/2 -translate-y-1/2 mr-2.5',
          arrow: 'left-full top-1/2 -translate-y-1/2'
        };
      case 'right':
        return {
          container: 'left-full top-1/2 -translate-y-1/2 ml-2.5',
          arrow: 'right-full top-1/2 -translate-y-1/2'
        };
      default: // top
        return {
          container: 'bottom-full left-1/2 -translate-x-1/2 mb-2.5',
          arrow: 'top-full left-1/2 -translate-x-1/2'
        };
    }
  };

  const positionClasses = getPositionClasses();
  const shouldAlignLeft = !!subtitle;

  const handleMouseEnter = () => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
  };

  const motionProps = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: position === 'top' ? 8 : position === 'bottom' ? -8 : (position === 'left' || position === 'right') ? '-50%' : 0,
      x: position === 'left' ? 8 : position === 'right' ? -8 : (position === 'top' || position === 'bottom') ? '-50%' : 0
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: (position === 'left' || position === 'right') ? '-50%' : 0,
      x: (position === 'top' || position === 'bottom') ? '-50%' : 0
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: position === 'top' ? 4 : position === 'bottom' ? -4 : (position === 'left' || position === 'right') ? '-50%' : 0,
      x: position === 'left' ? 4 : position === 'right' ? -4 : (position === 'top' || position === 'bottom') ? '-50%' : 0
    },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      opacity: { duration: 0.15 }
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...motionProps}
            className={`absolute ${positionClasses.container.replace(/-translate-[xy]-1\/2/g, '')} px-4 py-2 bg-[#0E1011]/90 backdrop-blur-md border-[0.5px] border-[#585858] rounded-[10px] z-[100] shadow-[0_8px_30px_rgb(0,0,0,0.5)] pointer-events-none`}
            style={{ width: 'max-content' }}
          >
            <div className={shouldAlignLeft ? 'text-left' : 'text-center'}>
              {/* Title */}
              <div className="text-white font-[Geist] text-[11px] not-italic font-semibold leading-[normal] tracking-[0.44px]">
                {title}
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="flex justify-center my-2">
                  <div className="p-0 overflow-hidden">
                    <QRCodeSVG
                      value={qrCode}
                      size={120}
                      level="M"
                      includeMargin={false}
                      bgColor="transparent"
                      fgColor="#FFFFFF"
                    />
                  </div>
                </div>
              )}

              {/* Subtitle / Description */}
              {subtitle && (
                <div className="mt-1">
                  {typeof subtitle === 'string' ? (
                    <div className="text-[#E4E9E7] font-[Geist] text-[10px] not-italic font-normal whitespace-pre-line leading-normal">
                      {subtitle}
                    </div>
                  ) : (
                    <div className="text-[#E4E9E7] font-[Geist] text-[10px] not-italic font-normal leading-normal">
                      {subtitle}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Arrow using a rotated square - clipped to prevent bleeding through translucent background */}
            <div className={`absolute ${positionClasses.arrow} w-2.5 h-2.5 bg-[#0E1011] border-[0.5px] border-[#585858] rotate-45 -z-10`}
              style={{
                marginTop: position === 'top' ? '-5px' : position === 'bottom' ? '-5px' : '0',
                marginLeft: position === 'left' ? '-5px' : position === 'right' ? '-5px' : '0',
                top: position === 'top' ? '100%' : position === 'bottom' ? '0' : '50%',
                left: position === 'left' ? '100%' : position === 'right' ? '0' : '50%',
                transform: `translate(-50%, -50%) rotate(45deg)`,
                // Only show borders on the outward-facing sides of the triangle
                borderTopColor: position === 'bottom' ? '#585858' : 'transparent',
                borderLeftColor: position === 'right' ? '#585858' : 'transparent',
                borderRightColor: position === 'left' ? '#585858' : 'transparent',
                borderBottomColor: position === 'top' ? '#585858' : 'transparent',
                // Clip the half of the diamond that overlaps with the tooltip and shouldn't be seen through the backdrop-blur
                clipPath: position === 'top' ? 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' :
                  position === 'bottom' ? 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' :
                    position === 'left' ? 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' :
                      'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;