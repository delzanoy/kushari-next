export function CheckBoxFilledIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className}`}
    >
      <g filter="url(#filter0_i_366_57390)">
        <rect x="2" y="2" width="14" height="14" rx="2" fill="#209762" />
      </g>
      <rect
        x="2.5"
        y="2.5"
        width="13"
        height="13"
        rx="1.5"
        stroke="#C7C7C7"
        style={{ mixBlendMode: "overlay" }}
      />
      <path
        d="M5.7 8.5L8.2 11L12.7 6.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <defs>
        <filter
          id="filter0_i_366_57390"
          x="2"
          y="2"
          width="16"
          height="16"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="4" dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0573943 0 0 0 0 0.389834 0 0 0 0 0.241772 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_366_57390" />
        </filter>
      </defs>
    </svg>
  );
}