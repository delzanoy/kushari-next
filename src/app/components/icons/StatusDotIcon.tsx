export function StatusDotIcon({
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
      <circle cx="9" cy="9" r="3"/>
    </svg>
  );
}


// review pending