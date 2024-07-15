import React, { memo, useEffect, useState } from 'react';
import transparentLight from '../../../assets/transparent-light.svg';
import transparent from '../../../assets/transparent.svg';
import { useTheme } from '../../../components/theme-provider';
import { formatNumber } from '../../../lib/utils';
import type { TextureDataState } from '../assets';

interface TextureViewerProps extends TextureDataState {
  onClick?: () => void;
  selected?: boolean;
}
export const TextureViewer: React.FC<TextureViewerProps> = memo(
  ({ blob, width, height, name, isLoaded, onClick, selected, gpuSize }) => {
    const { theme } = useTheme();
    const [imageSize, setImageSize] = useState<number | null>(null);
    useEffect(() => {
      async function fetchData() {
        if (name == '') {
          setImageSize(null);
          return;
        }
        try {
          const response = await fetch(name);
          const blob = await response.blob();
          setImageSize(blob.size / 1024);
        } catch (error) {
          setImageSize(null);
        }
      }
      fetchData();
    }, [name]);

    if (!blob) return null;
    const sanitizedName = name == '' ? 'Unnamed' : name.split('/').pop() || 'Unnamed';
    const bg = selected ? 'bg-secondary' : isLoaded ? 'bg-primary' : 'bg-border';
    const border = selected ? 'border-secondary' : 'border-border';
    return (
      <div
        className={`max-h-42 h-42 group-hover:bg-secondary hover:border-secondary ${border} flex w-40 cursor-pointer flex-col items-center justify-between rounded-sm border`}
        style={{ backgroundImage: `url(${theme === 'dark' ? transparent : transparentLight})` }}
        onClick={onClick}
      >
        <div className="group flex w-full flex-col">
          <div className="flex h-32 w-40 items-center justify-center overflow-hidden p-1">
            <img src={blob} alt="content" className="max-h-full max-w-full" />
          </div>
          <div className={`${bg} group-hover:bg-secondary rounded-b-sm`}>
            <div className={`w-full truncate px-1 py-0.5 pb-2 text-center text-xs text-white`}>{sanitizedName}</div>
            <div className={`h-auto w-full truncate px-1 py-0.5 text-left text-xs text-white`}>
              Size: {formatNumber(width, 1)} x {formatNumber(height, 1)}
            </div>
            {imageSize && (
              <div className="h-auto w-full truncate px-1 py-0.5 text-left text-xs text-white">
                File: {formatNumber(imageSize, 3)} KB
              </div>
            )}
            <div className={`h-auto w-full truncate px-1 py-0.5 text-left text-xs text-white`}>
              GPU: {formatNumber(gpuSize / (1024 * 1024), 3)} MB
            </div>
          </div>
        </div>
      </div>
    );
  },
);
