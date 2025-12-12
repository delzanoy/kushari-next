interface LineIconBaseProps {
  className?: string;
  size?: number;
}

export function ActiveLineIcon({ 
  className = "", 
  size = 19 
}: LineIconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className}`}
      width={size}
      height={size - 1}
      viewBox="0 0 19 18"
      fill="none"
    >
      <path
        d="M18 9L10 9"
        stroke="#069668"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InactiveLineIcon({ 
  className = "", 
  size = 19 
}: LineIconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className}`}
      width={size}
      height={size - 1}
      viewBox="0 0 19 18"
      fill="none"
    >
      <g opacity="0.3">
        <path
          d="M18 9L14 9"
          stroke="#C8CACB"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}