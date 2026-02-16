
import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 120, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-2xl ${className}`}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Rounded Square (App Icon Style) */}
      <rect width="512" height="512" rx="112" fill="#0B1020" />

      {/* Simplified Apple Shape (Clean & Minimalist) */}
      <path
        d="M256 420C170 420 120 350 120 280C120 200 170 140 256 140C342 140 392 200 392 280C392 350 342 420 256 420Z"
        fill="url(#logoGradient)"
        filter="url(#neonGlow)"
      />
      
      {/* Sleek Apple Leaf */}
      <path
        d="M256 140C256 90 300 70 330 70C330 70 315 115 256 140Z"
        fill="url(#logoGradient)"
      />

      {/* Subtle Light Reflection for Depth */}
      <path
        d="M320 200C350 230 350 280 340 310"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
};
