import { useEffect, useState } from 'react';
import { useDevtoolStore } from '../../../App';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { CanvasComponent } from '../../../components/smooth-charts/stat';

export const TextureStats: React.FC = () => {
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
      <div className="flex h-full max-h-[15%] flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-wrap justify-start overflow-auto">
          {stats &&
            Object.keys(stats!).map((key) => {
              const item = stats![key as keyof typeof stats];
              return (
                <div className="h-fit px-2 pt-2" key={key}>
                  <CanvasComponent
                    title={key}
                    bgColor={'#1D1E20'}
                    fgColor={'#E72264'}
                    lineColor="#441E2B"
                    value={item}
                  />
                </div>
              );
            })}
          {/* {currentStats.map((item) => {
            return (
              <div className="min-h-10 px-2 pt-2" key={item.name}>
                <span className="text-xs">
                  {item.name} ({stats![item.name as keyof typeof stats]})
                </span>
                <SmoothieComponent
                  key={item.name}
                  {...defaultSmoothieOptions}
                  minValue={0}
                  series={[
                    {
                      data: item.timeSeries,
                      strokeStyle: item.color,
                      fillStyle: seriesFillStyle,
                      lineWidth: 1,
                    },
                  ]}
                />
              </div>
            );
          })} */}
        </div>
      </div>
    </CollapsibleSection>
  );
};
