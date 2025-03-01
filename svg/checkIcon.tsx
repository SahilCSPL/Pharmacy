// CheckIcon.tsx
import React from 'react';

export interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

const CheckIcon: React.FC<CheckIconProps> = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    aria-hidden="true"
    className={`w-6 h-6 ${className}`}
    {...props}
  >
    <path d="M173.898 439.404l-166.4-166.4c-12.497-12.497-12.497-32.758 0-45.255l45.255-45.255c12.497-12.497 32.758-12.497 45.255 0L192 312.69l288.89-288.89c12.497-12.497 32.758-12.497 45.255 0l45.255 45.255c12.497 12.497 12.497 32.758 0 45.255l-334.4 334.4c-12.497 12.497-32.758 12.497-45.255 0z" />
  </svg>
);

export default CheckIcon;
