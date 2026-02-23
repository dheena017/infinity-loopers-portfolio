import React from 'react';

const SquadLogo = ({ size = 64, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer Box Frame */}
            <rect
                x="14"
                y="14"
                width="72"
                height="72"
                stroke="#EF4444"
                strokeWidth="10"
                fill="none"
            />

            {/* The Stylized 'K' Diagonal Elements */}
            <path
                d="M14 50 L86 14"
                stroke="#EF4444"
                strokeWidth="10"
                strokeLinecap="butt"
            />
            <path
                d="M14 50 L86 86"
                stroke="#EF4444"
                strokeWidth="10"
                strokeLinecap="butt"
            />

            {/* Internal vertical line to close the gap if needed, 
                though in the image it seems connected to the frame */}
        </svg>
    );
};

export default SquadLogo;
