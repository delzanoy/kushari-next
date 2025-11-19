export function ReadyDotIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`block ${className}`}
      aria-hidden="true"
      viewBox="0 0 18 18"
    >
      <path d="M6.36662 4.74967C7.49388 4.05125 8.85242 3.82924 10.1434 4.13248C11.4343 4.43572 12.5519 5.23937 13.2503 6.36662C13.9487 7.49388 14.1708 8.85241 13.8675 10.1434C13.5643 11.4343 12.7606 12.5519 11.6334 13.2503C10.5061 13.9487 9.14759 14.1708 7.85664 13.8675C6.56569 13.5643 5.44808 12.7606 4.74967 11.6334C4.05125 10.5061 3.82924 9.14759 4.13248 7.85664C4.43572 6.56569 5.23936 5.44808 6.36662 4.74967L6.36662 4.74967Z" stroke="#F8FCFF" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 3"/>
    </svg>
  );
}


// review pending