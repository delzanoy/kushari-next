interface ForbiddenIconProps {
  className?: string;
  size?: number;
}

export function ForbiddenIcon({ 
  className = "", 
  size = 32 
}: ForbiddenIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M16 29.3337C8.63622 29.3337 2.66669 23.3641 2.66669 16.0003C2.66669 8.63653 8.63622 2.66699 16 2.66699C23.3638 2.66699 29.3334 8.63653 29.3334 16.0003C29.3334 23.3641 23.3638 29.3337 16 29.3337ZM11.3642 9.47887C11.0061 9.73405 10.6644 10.0222 10.3432 10.3435C10.0219 10.6647 9.73374 11.0064 9.47857 11.3645L20.6359 22.5218C20.9939 22.2666 21.3356 21.9785 21.6568 21.6571C21.9782 21.3359 22.2663 20.9942 22.5215 20.6362L11.3642 9.47887Z"
        fill="#EFFF16"
      />
    </svg>
  );
}