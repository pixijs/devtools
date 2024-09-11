import { useEffect, useState } from 'react';
import { useDevtoolStore } from '../../../App';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { CanvasStatComponent } from '../../../components/smooth-charts/stat';
import { useTheme } from '../../../components/theme-provider';

export const TextureStats: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<Record<string, number>>({
    'GPU Memory (MB)': 0,
    'Total Textures': 0,
    'Textures on GPU': 0,
  });
  const textures = useDevtoolStore.use.textures();

  useEffect(() => {
    const totalMemory = textures.reduce((acc, texture) => acc + texture.gpuSize, 0);
    const totalTextures = textures.length;
    const totalLoadedTextures = textures.filter((texture) => texture.isLoaded).length;

    setStats({
      'GPU Memory (MB)': Number((totalMemory / 1024 / 1024).toFixed(2)),
      'Total Textures': totalTextures,
      'Textures on GPU': totalLoadedTextures,
    });
  }, [textures]);

  return (
    <CollapsibleSection title="Stats">
      <div className="flex h-full max-h-[10%] flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-wrap justify-start overflow-auto pb-4">
          {stats &&
            Object.keys(stats!).map((key) => {
              const item = stats![key as keyof typeof stats];
              return (
                <div className="h-fit px-2 pt-2" key={key}>
                  <CanvasStatComponent
                    title={key}
                    bgColor={theme === 'dark' ? '#1D1E20' : '#fff'}
                    fgColor={theme === 'dark' ? '#E72264' : '#E72264'}
                    lineColor={theme === 'dark' ? '#441E2B' : '#EC5685'}
                    textColor={theme === 'dark' ? '#fff' : '#000'}
                    value={item}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </CollapsibleSection>
  );
};
