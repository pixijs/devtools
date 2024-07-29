import React, { memo } from 'react';
import { useTheme } from '../../../../components/theme-provider';
import { cn } from '../../../../lib/utils';

interface TextureProps {
  texture: string;
  size?: number;
  border?: string;
}
export const Texture: React.FC<TextureProps> = memo(({ texture, size, border }) => {
  const { theme } = useTheme();
  const w = `w-${size ?? 40}`;
  const h = `h-${size ?? 40}`;
  const b = border ?? 'border-background';
  const darkColor1 = 'hsla(0, 0%, 15%, 1)';
  const darkColor2 = 'hsla(0, 0%, 24%, 1)';
  const lightColor1 = 'hsla(0, 0%, 100%, 1)';
  const lightColor2 = 'hsla(0, 0%, 90%, 1)';
  const gridColor1 = theme === 'dark' ? darkColor1 : lightColor1;
  const gridColor2 = theme === 'dark' ? darkColor2 : lightColor2;
  const svgString = encodeURIComponent(
    `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="${gridColor1}" />
          <rect x="10" y="10" width="10" height="10" fill="${gridColor1}" />
          <rect x="0" y="10" width="10" height="10" fill="${gridColor2}" />
          <rect x="10" y="0" width="10" height="10" fill="${gridColor2}" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>`,
  );
  return (
    <div
      className={cn(
        b,
        w,
        h,
        `outline-primary flex cursor-pointer flex-col items-center justify-between rounded-md outline outline-1`,
      )}
      style={{ backgroundImage: `url("data:image/svg+xml,${svgString}")` }}
    >
      <div className="group flex h-full w-full flex-col">
        <div className={cn(w, h, `flex items-center justify-center overflow-hidden`)}>
          <img src={texture} alt="content" className="h-full w-full object-contain p-1" />
        </div>
      </div>
    </div>
  );
});
