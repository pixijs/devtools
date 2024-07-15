import { useDevtoolStore } from '../../../App';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import SmoothieComponent, { TimeSeries } from '../../../components/smooth-charts/Smoothie';
import { useTheme } from '../../../components/theme-provider';
import { useEffect, useRef, useState } from 'react';

interface StatData {
  timeSeries: TimeSeries;
  name: string;
  color: string;
}

const defaultSmoothieOptions = {
  width: 250,
  grid: {
    strokeStyle: 'transparent',
    fillStyle: 'transparent',
  },
  labels: {
    fillStyle: 'rgb(255, 255, 255)',
    precision: 0,
  },
  millisPerPixel: 60,
  height: 30,
};

const updateGraph = (timeSeries: TimeSeries, numContainers: number) => {
  timeSeries.append(new Date().getTime(), numContainers);
};

const currentStats = [] as StatData[];
currentStats.push({
  timeSeries: new TimeSeries(),
  name: 'GPU Memory (MB)',
  color: '#E72264',
});
currentStats.push({
  timeSeries: new TimeSeries(),
  name: 'Total Textures',
  color: '#E72264',
});
currentStats.push({
  timeSeries: new TimeSeries(),
  name: 'Textures loaded on GPU',
  color: '#E72264',
});
const stats = {
  'GPU Memory (MB)': 0,
  'Total Textures': 0,
  'Textures loaded on GPU': 0,
};
export const TextureStats: React.FC = () => {
  const { theme } = useTheme();
  const [savedStats] = useState<StatData[]>(currentStats);
  const textures = useDevtoolStore.use.textures();
  const animationRef = useRef<number>();

  defaultSmoothieOptions.labels.fillStyle = theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
  const seriesFillStyle = theme === 'dark' ? 'rgba(231, 34, 100, 0.2)' : 'rgba(231, 34, 100, 0.8)';

  useEffect(() => {
    // GPU Memory (MB)
    const totalMemory = textures.reduce((acc, texture) => acc + texture.gpuSize, 0);
    // total textures
    const totalTextures = textures.length;
    // Textures loaded on GPU
    const totalLoadedTextures = textures.filter((texture) => texture.isLoaded).length;

    stats['GPU Memory (MB)'] = Number((totalMemory / 1024 / 1024).toFixed(2));
    stats['Total Textures'] = totalTextures;
    stats['Textures loaded on GPU'] = totalLoadedTextures;

    animationRef.current && cancelAnimationFrame(animationRef.current);

    let savedTime = 0;
    const loop = () => {
      const currentTime = Date.now();

      if (currentTime - 250 > savedTime) {
        savedTime = currentTime;
        savedStats.forEach((item) => {
          updateGraph(item.timeSeries, stats![item.name as keyof typeof stats]);
        });
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    // Start the loop
    animationRef.current = requestAnimationFrame(loop);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, [savedStats, textures]);

  return (
    <CollapsibleSection title="Stats">
      <div className="flex h-full max-h-[15%] flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-wrap justify-start overflow-auto">
          {currentStats.map((item) => {
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
          })}
        </div>
      </div>
    </CollapsibleSection>
  );
};
