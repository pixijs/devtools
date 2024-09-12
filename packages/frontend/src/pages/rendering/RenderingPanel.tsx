import { useEffect, useState } from 'react';
import { useDevtoolStore } from '../../App';
import { InstructionsPanel } from './InstructionsPanel';
import { RenderingStats } from './RenderingStats';
import { CanvasPanel } from './CanvasPanel';

export const RenderingPanel = () => {
  const [version, setVersion] = useState<string | null>(null);
  const bridge = useDevtoolStore.use.bridge();

  useEffect(() => {
    async function fetchData() {
      const res = await bridge!('window.__PIXI_DEVTOOLS_WRAPPER__.majorVersion');
      setVersion(res as string);
    }
    fetchData();
  }, [bridge]);

  if (!version || Number(version) < 8) {
    return (
      <div className="flex flex-grow flex-col overflow-hidden">
        <div className="flex flex-grow items-center justify-center text-2xl dark:text-white">
          This panel is only available for PixiJS 8 and above
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col overflow-hidden">
      <RenderingStats />
      <CanvasPanel />
      <InstructionsPanel />
    </div>
  );
};
