export function CheckBoxOutlineIcon({
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
      <rect
        x="2.5"
        y="2.5"
        width="13"
        height="13"
        rx="1.5"
        stroke="#C7C7C7"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}