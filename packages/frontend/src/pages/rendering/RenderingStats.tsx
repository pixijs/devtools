import { useEffect, useRef, useState } from 'react';
import { useDevtoolStore } from '../../App';
import { CollapsibleSection } from '../../components/collapsible/collapsible-section';
import SmoothieComponent, { TimeSeries } from '../../components/smooth-charts/Smoothie';
import { useTheme } from '../../components/theme-provider';
import { useInterval } from '../../lib/interval';
import { isDifferent } from '../../lib/utils';
import type { RenderingState } from './rendering';

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
  name: 'Draw Calls',
  color: '#E72264',
});
currentStats.push({
  timeSeries: new TimeSeries(),
  name: 'FPS',
  color: '#E72264',
});
currentStats.push({
  timeSeries: new TimeSeries(),
  name: 'Rebuild Frequency',
  color: '#E72264',
});
const stats = {
  'Draw Calls': 0,
  FPS: 0,
  'Rebuild Frequency': 0,
};
export const RenderingStats: React.FC = () => {
  const { theme } = useTheme();
  const bridge = useDevtoolStore.use.bridge();
  const renderingData = useDevtoolStore.use.renderingData();
  const setRenderingData = useDevtoolStore.use.setRenderingData();
  const [savedStats] = useState<StatData[]>(currentStats);
  const animationRef = useRef<number>();

  defaultSmoothieOptions.labels.fillStyle = theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
  const seriesFillStyle = theme === 'dark' ? 'rgba(231, 34, 100, 0.2)' : 'rgba(231, 34, 100, 0.8)';

  useInterval(async () => {
    const res = await bridge!('window.__PIXI_DEVTOOLS_WRAPPER__.rendering.captureRenderingData()');

    if (isDifferent(res, renderingData)) {
      setRenderingData(res as RenderingState['renderingData']);
    }
  }, 100);

  useEffect(() => {
    if (!renderingData) {
      return;
    }
    stats['Rebuild Frequency'] = renderingData.rebuildFrequency;
    stats.FPS = renderingData.fps;
    stats['Draw Calls'] = renderingData.drawCalls;

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
  }, [savedStats, renderingData]);

  return (
    <CollapsibleSection title="Stats">
      <div className="flex h-fit max-h-[15%] overflow-hidden pb-4">
        <div className="flex h-full w-full flex-wrap justify-start overflow-hidden pb-4">
          {currentStats.map((item) => {
            return (
              <div className="h-fit px-2 pt-2" key={item.name}>
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
