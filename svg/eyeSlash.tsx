import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const EyeSlashIcon: React.FC<IconProps> = ({ className, ...props }) => (
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
      {/* A simplified version of an eye with a slash */}
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8s2.37-4.57 6.44-6.32" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );