import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const EyeIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Eye outline */}
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    {/* Pupil */}
    <circle cx="12" cy="12" r="3" />
  </svg>
);