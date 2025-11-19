export function EthereumIcon({
    className = "",
}: {
    className?: string;
}) {
    return (
        <svg
            className={`block ${className}`}
            fill="currentColor"
            aria-hidden="true"
            viewBox="0 0 24 24"
        >
            <g clipPath="url(#clip0_2_1168)">
                <path d="M8.99993 22.9994L15.0001 22.9994C18.7713 22.9994 20.6569 22.9994 21.8285 21.8279C23.0001 20.6563 23.0001 18.7707 23.0001 14.9994L23.0001 8.99931C23.0001 5.22807 23.0001 3.34245 21.8285 2.17088C20.6569 0.999307 18.7713 0.999307 15.0001 0.999307H8.99993C5.22869 0.999307 3.34308 0.999307 2.1715 2.17088C0.99993 3.34245 0.999929 5.22807 0.99993 8.99931V14.9994C0.99993 18.7707 0.99993 20.6563 2.1715 21.8279C3.34308 22.9994 5.2287 22.9994 8.99993 22.9994Z" fill="#627EEA" />
                <path d="M12.3735 3.00003V9.65253L17.9963 12.165L12.3735 3.00003Z" fill="white" fillOpacity="0.602" />
                <path d="M12.3735 3.00003L6.75 12.165L12.3735 9.65253V3.00003Z" fill="white" />
                <path d="M12.3735 16.476V20.9963L18 13.212L12.3735 16.476Z" fill="white" fillOpacity="0.602" />
                <path d="M12.3735 20.9963V16.4753L6.75 13.212L12.3735 20.9963Z" fill="white" />
                <path d="M12.3735 15.4298L17.9963 12.165L12.3735 9.65402V15.4298Z" fill="white" fillOpacity="0.2" />
                <path d="M6.75 12.165L12.3735 15.4298V9.65402L6.75 12.165Z" fill="white" fillOpacity="0.602" />
            </g>
            <defs>
                <clipPath id="clip0_2_1168">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
