// import React from 'react';
// import {QRCodeSVG} from 'qrcode.react';

// interface TooltipProps {
//   children: React.ReactNode;
//   title: string;
//   subtitle?: string;
//   qrCode?: string;
//   position?: 'top' | 'bottom' | 'left' | 'right';
//   className?: string;
//   icon?: React.ReactNode;
//   open?: boolean; // Add this for external control
//   onOpenChange?: (open: boolean) => void; // Optional: for controlled state
// }

// const Tooltip: React.FC<TooltipProps> = ({
//   children,
//   title,
//   subtitle,
//   qrCode,
//   position = 'top',
//   className = '',
//   icon,
//   open, // External control prop
//   onOpenChange
// }) => {
//   const getPositionClasses = () => {
//     switch (position) {
//       case 'bottom':
//         return {
//           container: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
//           arrow: 'bottom-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-b-[#EEF0F1]'
//         };
//       case 'left':
//         return {
//           container: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
//           arrow: 'left-full top-1/2 transform -translate-y-1/2 border-6 border-transparent border-l-[#EEF0F1]'
//         };
//       case 'right':
//         return {
//           container: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
//           arrow: 'right-full top-1/2 transform -translate-y-1/2 border-6 border-transparent border-r-[#EEF0F1]'
//         };
//       default: // top
//         return {
//           container: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
//           arrow: 'top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-[#EEF0F1]'
//         };
//     }
//   };

//   const positionClasses = getPositionClasses();

//   // Determine visibility based on props
//   const isControlled = open !== undefined;
//   const showTooltip = isControlled ? open : false;
  
//   // Use group-hover only when not controlled
//   const visibilityClass = isControlled
//     ? (showTooltip ? 'opacity-100' : 'opacity-0')
//     : 'opacity-0 group-hover/network:opacity-100';

//   return (
//     <div 
//       className={`${isControlled ? '' : 'group/network'} relative inline-block ${className}`}
//       onMouseEnter={isControlled ? () => onOpenChange?.(true) : undefined}
//       onMouseLeave={isControlled ? () => onOpenChange?.(false) : undefined}
//     >
//       {children}
//       <div 
//         className={`absolute ${positionClasses.container} px-4 py-2 font-[Geist] text-[12px] text-black font-semibold leading-[normal] tracking-[0.44px] bg-[#EEF0F1] rounded-[10px] transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg ${visibilityClass}`}
//       >
//         <div className="text-center">
//           <div className="font-semibold">{title}</div>
//           {qrCode && (
//               <QRCodeSVG
//                 value={qrCode}
//                 size={128}
//                 level="M"
//                 className='m-2'
//               />
//           )}

//           {subtitle && (
//             <div className="text-[10px] text-gray-600 font-normal mt-0.5">
//               {subtitle}
//             </div>
//           )}
//         </div>
//         <div className={`absolute ${positionClasses.arrow}`}></div>
//       </div>
//     </div>
//   );
// };

// export default Tooltip;



import React from 'react';
import {QRCodeSVG} from 'qrcode.react';

interface TooltipProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  qrCode?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  icon?: React.ReactNode;
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
  icon,
  open,
  onOpenChange
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return {
          container: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
          arrow: 'bottom-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-b-[#EEF0F1]'
        };
      case 'left':
        return {
          container: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
          arrow: 'left-full top-1/2 transform -translate-y-1/2 border-6 border-transparent border-l-[#EEF0F1]'
        };
      case 'right':
        return {
          container: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
          arrow: 'right-full top-1/2 transform -translate-y-1/2 border-6 border-transparent border-r-[#EEF0F1]'
        };
      default: // top
        return {
          container: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
          arrow: 'top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-[#EEF0F1]'
        };
    }
  };

  const positionClasses = getPositionClasses();

  // Determine visibility based on props
  const isControlled = open !== undefined;
  const showTooltip = isControlled ? open : false;
  
  // Use group-hover only when not controlled
  const visibilityClass = isControlled
    ? (showTooltip ? 'opacity-100' : 'opacity-0')
    : 'opacity-0 group-hover/network:opacity-100';

  // Determine if we should align left (when subtitle is present)
  const shouldAlignLeft = !!subtitle;

  return (
    <div 
      className={`${isControlled ? '' : 'group/network'} relative inline-block ${className}`}
      onMouseEnter={isControlled ? () => onOpenChange?.(true) : undefined}
      onMouseLeave={isControlled ? () => onOpenChange?.(false) : undefined}
    >
      {children}
      <div 
        className={`absolute ${positionClasses.container} px-4 py-2 font-[Geist] text-[12px] text-black font-semibold leading-[normal] tracking-[0.44px] bg-[#EEF0F1] rounded-[10px] transition-opacity duration-200 pointer-events-none z-10 shadow-lg ${visibilityClass} max-w-xs`}
        style={{ width: 'max-content' }}
      >
        <div className={shouldAlignLeft ? 'text-left' : 'text-center'}>
          {/* Title */}
          <div className="text-black font-[Geist] text-[11px] not-italic font-semibold leading-[normal] tracking-[0.44px]">{title}</div>
          
          {/* QR Code - Keep centered regardless of alignment */}
          {qrCode && (
            <div className="flex justify-center my-2">
              <QRCodeSVG
                value={qrCode}
                size={128}
                level="M"
              />
            </div>
          )}

          {/* Subtitle - Align left when present */}
          {subtitle && (
            <div className="mt-0.5">
              {typeof subtitle === 'string' ? (
                <div className="text-black font-[Geist] text-[10px] not-italic font-normal whitespace-pre-line leading-relaxed">
                  {subtitle}
                </div>
              ) : (
                <div className="text-black font-[Geist] text-[10px] not-italic font-normal leading-relaxed">
                  {subtitle}
                </div>
              )}
            </div>
          )}
        </div>
        <div className={`absolute ${positionClasses.arrow}`}></div>
      </div>
    </div>
  );
};

export default Tooltip;