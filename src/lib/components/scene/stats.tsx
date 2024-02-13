import { usePixiStore } from '@lib/pages';
import React, { useEffect } from 'react';
import { SectionContainer, SectionHeader, Title, TitleGroup } from '../Container';
import SmoothieComponent, { TimeSeries } from '../smooth-charts/Smoothie';

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

const data = [
  {
    title: 'Total',
    statName: 'totalSceneObjects',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'Container',
    statName: 'container',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'Sprite',
    statName: 'sprite',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'Graphics',
    statName: 'graphics',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'Filters',
    statName: 'filter',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'Meshes',
    statName: 'mesh',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'Texts',
    statName: 'text',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'BitmapTexts',
    statName: 'bitmapText',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
  {
    title: 'HTMLTexts',
    statName: 'htmlText',
    color: '#E72264',
    timeSeries: new TimeSeries({
      resetBounds: true,
      resetBoundsInterval: 3000,
    }),
  },
] as const;

const updateGraph = (timeSeries: TimeSeries, numContainers: number) => {
  timeSeries.append(new Date().getTime(), numContainers);
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StatsProps {}
export const Stats: React.FC<StatsProps> = () => {
  const sceneStats = usePixiStore((state) => state.sceneStats);

  console.log('rendering stats');

  useEffect(() => {
    const intervalIds = data.map((item) => {
      return setInterval(() => {
        const sceneStats = usePixiStore.getState().sceneStats;
        updateGraph(item.timeSeries, sceneStats[item.statName]);
      }, 100);
    });
    // Clean up on unmount
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [sceneStats]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      {data.map((item, index) => (
        <SectionContainer key={index}>
          <SectionHeader>
            <TitleGroup>
              <Title>
                {item.title} ({sceneStats[item.statName]})
              </Title>
            </TitleGroup>
            <SmoothieComponent
              {...defaultSmoothieOptions}
              minValue={0}
              series={[
                {
                  data: item.timeSeries,
                  strokeStyle: item.color,
                  fillStyle: 'rgba(231, 34, 100, 0.2)',
                  lineWidth: 1,
                },
              ]}
            />
          </SectionHeader>
        </SectionContainer>
      ))}
    </div>
  );
};
