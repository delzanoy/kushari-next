export function ExecutingIcon({
    className = "",
}: {
    className?: string;
}) {
    return (
        <svg
            className={`block spin-mechanical ${className}`}
            fill="transparent"
            aria-hidden="true"
            viewBox="0 0 16 16"
        >
            <circle
                cx="8"
                cy="8"
                r="6"
                stroke="#F8FCFF"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="33"
                strokeDashoffset="4"
            />
        </svg>
    );
}
