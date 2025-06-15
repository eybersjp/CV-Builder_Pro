
import * as React from "react";

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <g>
      <path fill="#4285F4" d="M19.6 10.23c0-.73-.06-1.46-.18-2.17H10v4.11h5.37a4.6 4.6 0 0 1-2.02 3.01l3.26 2.54c1.91-1.76 3-4.36 3-7.49z"/>
      <path fill="#34A853" d="M10 20c2.7 0 4.97-.89 6.62-2.41l-3.26-2.54c-.9.6-2.06.96-3.36.96-2.58 0-4.77-1.74-5.56-4.09H1.08v2.58A10 10 0 0 0 10 20z"/>
      <path fill="#FBBC05" d="M4.44 11.92A5.97 5.97 0 0 1 4.1 10c0-.66.11-1.3.32-1.92V5.5H1.08A10 10 0 0 0 0 10c0 1.57.37 3.06 1.08 4.5l3.36-2.58z"/>
      <path fill="#EA4335" d="M10 4a5.4 5.4 0 0 1 3.84 1.5l2.86-2.85C14.97 1.12 12.7 0 10 0 6.07 0 2.74 2.48 1.08 5.5L4.44 8.08C5.23 5.73 7.42 4 10 4z"/>
    </g>
  </svg>
);

export default GoogleIcon;
