'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface WaveLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
}

export const WaveLogo: React.FC<WaveLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'color',
}) => {
  const { config } = useSiteConfig();

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const isDark = variant === 'dark';
  const isLight = variant === 'light';

  const iconColor = isLight ? '#EAE7DC' : '#E85A4F';
  const iconAccent = isLight ? '#E98074' : '#E85A4F';

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* BillFlow Icon — stylised invoice/receipt with lightning bolt */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Rounded rect representing an invoice document */}
          <rect
            x="5"
            y="3"
            width="22"
            height="28"
            rx="3"
            fill={iconColor}
            opacity="0.15"
          />
          <rect
            x="5"
            y="3"
            width="22"
            height="28"
            rx="3"
            stroke={iconColor}
            strokeWidth="2.2"
          />
          {/* Three horizontal lines representing line items */}
          <line x1="10" y1="12" x2="23" y2="12" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="10" y1="17" x2="20" y2="17" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="10" y1="22" x2="22" y2="22" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" />
          {/* Lightning bolt overlay — "fast payment" */}
          <path
            d="M22 3.5L16.5 19H21L14 32.5L20.5 17H16L22 3.5Z"
            fill={iconAccent}
            stroke="none"
          />
        </svg>
      </div>

      <span
        className={`font-extrabold tracking-tight ${textSizes[size]} ${
          isLight ? 'text-[#EAE7DC]' : 'text-[#2B2824]'
        }`}
      >
        {config.brandName}
      </span>
    </div>
  );
};
