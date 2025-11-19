export function StatusSquarecle({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`block ${className}`}
      fill="currentColor"
      aria-hidden="true"
      viewBox="0 0 18 18"
    >
      <rect x="6" y="6" width="6" height="6" rx="2"/>
    </svg>
  );
}


// review pending