import React from 'react';

const NoDataIcon = ({ width = 80, height = 100, color = '#333' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M60 0H5C2.25 0 0 2.25 0 5V95C0 97.75 2.25 100 5 100H75C77.75 100 80 97.75 80 95V20L60 0Z" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
      />
      <path 
        d="M60 0V20H80" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
      />
      <circle cx="30" cy="50" r="4" fill={color} />
      <circle cx="50" cy="50" r="4" fill={color} />
      <path 
        d="M25 70C30 65 50 65 55 70" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
        transform="scale(1,-1) translate(0,-140)"
      />
    </svg>
  );
};

export default NoDataIcon;