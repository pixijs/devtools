import React from 'react';
import { useTheme } from '../theme-provider';

interface SVGTextureProps {
  color: string;
}

export const SVGTexture: React.FC<SVGTextureProps> = ({ color }) => {
  const { theme } = useTheme();

  const color1 = theme === 'dark' ? 'hsla(0,0%,15%,0.75)' : 'hsla(0,0%,94%,0.75)';

  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={color1} />
          <rect x="10" y="10" width="10" height="10" fill={color1} />
          <rect x="0" y="10" width="10" height="10" fill={color} />
          <rect x="10" y="0" width="10" height="10" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
