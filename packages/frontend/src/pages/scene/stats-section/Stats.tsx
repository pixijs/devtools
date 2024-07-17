import { useDevtoolStore } from '../../../App';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import SmoothieComponent, { TimeSeries } from '../../../components/smooth-charts/Smoothie';
import { useTheme } from '../../../components/theme-provider';
import { memo, useEffect, useMemo, useRef } from 'react';

const SmoothieStat: React.FC<{
  item: StatData;
  stat: number;
  seriesFillStyle: string;
  defaultSmoothieOptions: any;
}> = memo(({ item, stat, seriesFillStyle, defaultSmoothieOptions }) => {
  const seriesOptions = useMemo(
    () => [
      {
        data: item.timeSeries,
        strokeStyle: item.color,
        fillStyle: seriesFillStyle,
        lineWidth: 1,
      },
    ],
    [item.timeSeries, item.color, seriesFillStyle],
  );

  return (
    <div className="min-h-10 px-2 pt-2" key={item.name}>
      <span className="text-xs">
        {item.name} ({stat})
      </span>
      <SmoothieComponent {...defaultSmoothieOptions} minValue={0} series={seriesOptions} />
    </div>
  );
});

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

let currentStats = [] as StatData[];
export const Stats: React.FC = () => {
  const { theme } = useTheme();
  const stats = useDevtoolStore.use.stats();
  const animationRef = useRef<number>();

  defaultSmoothieOptions.labels.fillStyle = theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
  const seriesFillStyle = theme === 'dark' ? 'rgba(231, 34, 100, 0.2)' : 'rgba(231, 34, 100, 0.8)';

  // make sure every stat has a time series, and delete any that are no longer in the stats
  currentStats = Object.keys(stats ?? {}).map((stat) => {
    const existingStat = currentStats.find((item) => item.name === stat);
    if (existingStat) {
      return existingStat;
    } else {
      return {
        timeSeries: new TimeSeries(),
        name: stat,
        color: '#E72264',
      };
    }
  });

  useEffect(() => {
    animationRef.current && cancelAnimationFrame(animationRef.current);

    let savedTime = 0;
    const loop = () => {
      const currentTime = Date.now();

      if (currentTime - 250 > savedTime) {
        savedTime = currentTime;
        currentStats.forEach((item) => {
          updateGraph(item.timeSeries, stats![item.name]);
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
  }, [stats]);

  return (
    <CollapsibleSection title="Stats">
      <div className="flex h-full max-h-[15%] flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-wrap justify-start overflow-auto">
          {currentStats.map((item) => {
            return (
              <SmoothieStat
                key={item.name}
                item={item}
                stat={stats![item.name]}
                seriesFillStyle={seriesFillStyle}
                defaultSmoothieOptions={defaultSmoothieOptions}
              />
            );
          })}
        </div>
      </div>
    </CollapsibleSection>
  );
};
