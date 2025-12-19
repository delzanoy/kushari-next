// RadioButtonIcons.tsx
import React from 'react';

// Define proper SVG props interface
interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// Empty state (unchecked)
export function RadioEmptyIcon({ className = "", ...props }: SVGIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`block ${className}`}
      viewBox="0 0 18 18" 
      fill="none"
      {...props}
    >
      <circle cx="9" cy="9" r="6.5" fill="#252728" stroke="#52525B"/>
    </svg>
  );
}

// Hover state
export function RadioHoverIcon({ className = "", ...props }: SVGIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`block ${className}`}
      viewBox="0 0 18 18" 
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_316_24115)">
        <circle cx="9" cy="9" r="6.5" fill="#252728" stroke="#52525B"/>
        <g filter="url(#filter0_dd_316_24115)">
          <circle cx="9" cy="9" r="7" fill="url(#paint0_linear_316_24115)" fillOpacity="0.5"/>
          <circle cx="9" cy="9" r="6.5" stroke="url(#paint1_linear_316_24115)"/>
        </g>
        <g filter="url(#filter1_dd_316_24115)">
          <circle cx="9" cy="9" r="3" fill="url(#paint2_linear_316_24115)"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_dd_316_24115" x="-12" y="2" width="42" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="12"/>
          <feGaussianBlur stdDeviation="5.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.788235 0 0 0 0 0.784314 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_316_24115"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="22"/>
          <feGaussianBlur stdDeviation="7"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.788235 0 0 0 0 0.784314 0 0 0 0.01 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_316_24115" result="effect2_dropShadow_316_24115"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_316_24115" result="shape"/>
        </filter>
        <filter id="filter1_dd_316_24115" x="-8" y="6" width="34" height="42" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="12"/>
          <feGaussianBlur stdDeviation="5.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.788235 0 0 0 0 0.784314 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_316_24115"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="22"/>
          <feGaussianBlur stdDeviation="7"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.788235 0 0 0 0 0.784314 0 0 0 0.01 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_316_24115" result="effect2_dropShadow_316_24115"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_316_24115" result="shape"/>
        </filter>
        <linearGradient id="paint0_linear_316_24115" x1="9.04348" y1="2" x2="9.04348" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CECEC" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#26C9C9" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id="paint1_linear_316_24115" x1="9.04294" y1="2" x2="9.04294" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CECEC" stopOpacity="0.3"/>
          <stop offset="1" stopColor="#26C9C9" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id="paint2_linear_316_24115" x1="9.01863" y1="6" x2="9.01863" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DDFBFC"/>
          <stop offset="1" stopColor="#85F2F4"/>
        </linearGradient>
        <clipPath id="clip0_316_24115">
          <rect width="18" height="18" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// Filled/Checked state
export function RadioFilledIcon({ className = "", ...props }: SVGIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`block ${className}`}
      viewBox="0 0 18 18" 
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_316_24124)">
        <g filter="url(#filter0_dd_316_24124)">
          <circle cx="9" cy="9" r="7" fill="url(#paint0_linear_316_24124)"/>
          <circle cx="9" cy="9" r="6.75" stroke="url(#paint1_linear_316_24124)" strokeWidth="0.5"/>
        </g>
        <g filter="url(#filter1_ddd_316_24124)">
          <circle cx="9" cy="9" r="3" fill="#FBFEFE"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_dd_316_24124" x="-12" y="2" width="42" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="12"/>
          <feGaussianBlur stdDeviation="5.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.788235 0 0 0 0 0.784314 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_316_24124"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="22"/>
          <feGaussianBlur stdDeviation="7"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.788235 0 0 0 0 0.784314 0 0 0 0.01 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_316_24124" result="effect2_dropShadow_316_24124"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_316_24124" result="shape"/>
        </filter>
        <filter id="filter1_ddd_316_24124" x="5" y="6" width="8" height="10" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="0.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.0156863 0 0 0 0 0.0784314 0 0 0 0 0.0823529 0 0 0 0.09 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_316_24124"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="0.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.0156863 0 0 0 0 0.0784314 0 0 0 0 0.0823529 0 0 0 0.05 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_316_24124" result="effect2_dropShadow_316_24124"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="3"/>
          <feGaussianBlur stdDeviation="0.5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.0156863 0 0 0 0 0.0784314 0 0 0 0 0.0823529 0 0 0 0.01 0"/>
          <feBlend mode="normal" in2="effect2_dropShadow_316_24124" result="effect3_dropShadow_316_24124"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_316_24124" result="shape"/>
        </filter>
        <linearGradient id="paint0_linear_316_24124" x1="9.04348" y1="2" x2="9.04348" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E8889"/>
          <stop offset="1" stopColor="#155455"/>
        </linearGradient>
        <linearGradient id="paint1_linear_316_24124" x1="9.04294" y1="2" x2="9.04294" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CECEC" stopOpacity="0.3"/>
          <stop offset="1" stopColor="#26C9C9" stopOpacity="0.2"/>
        </linearGradient>
        <clipPath id="clip0_316_24124">
          <rect width="18" height="18" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// Optional: Smart component that handles state automatically
export function RadioButtonIcon({ 
  checked = false, 
  hover = false, 
  disabled = false,
  className = "",
  ...props 
}: {
  checked?: boolean;
  hover?: boolean;
  disabled?: boolean;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  
  if (disabled) {
    return <RadioEmptyIcon className={`opacity-50 ${className}`} {...props} />;
  }
  
  if (checked) {
    return <RadioFilledIcon className={className} {...props} />;
  }
  
  if (hover) {
    return <RadioHoverIcon className={className} {...props} />;
  }
  
  return <RadioEmptyIcon className={className} {...props} />;
}