import React from "react";

export default function AIIcon({ size = 26 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Antenna */}
            <path
                d="M16 5V2.8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <circle
                cx="16"
                cy="2.5"
                r="1.5"
                fill="currentColor"
            />

            {/* Robot head */}
            <rect
                x="5"
                y="7"
                width="22"
                height="18"
                rx="6"
                stroke="currentColor"
                strokeWidth="2"
            />

            {/* Eyes */}
            <circle
                cx="11.5"
                cy="15"
                r="2"
                fill="currentColor"
            />

            <circle
                cx="20.5"
                cy="15"
                r="2"
                fill="currentColor"
            />

            {/* Mouth */}
            <path
                d="M11 20C13.5 22 18.5 22 21 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Side details */}
            <path
                d="M5 13H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <path
                d="M29 13H27"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}