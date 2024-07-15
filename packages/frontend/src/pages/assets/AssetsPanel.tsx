import { useEffect, useState } from 'react';
import { useDevtoolStore } from '../../App';
import { CollapsibleSplit } from '../../components/collapsible/collapsible-split';
import { GPUTextures } from './gpuTextures/GPUTextures';
import { TextureProperties } from './gpuTextures/TextureProperties';
import { TextureStats } from './gpuTextures/TextureStats';

export const AssetsPanel = () => {
  const [version, setVersion] = useState<string | null>(null);
  const bridge = useDevtoolStore.use.bridge();

  useEffect(() => {
    async function fetchData() {
      const res = await bridge!('window.__PIXI_DEVTOOLS_WRAPPER__.majorVersion');
      setVersion(res as string);
    }
    fetchData();
  }, [bridge]);

  if (!version) {
    return null;
  }

  if (Number(version) < 8) {
    return (
      <div className="flex flex-grow flex-col overflow-hidden">
        <div className="flex flex-grow items-center justify-center text-2xl text-white">
          This panel is only available for PixiJS 8 and above
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col overflow-hidden">
      <TextureStats />
      <CollapsibleSplit
        left={<GPUTextures />}
        right={<TextureProperties />}
        rightOptions={{ maxSize: 35 }}
        title="Textures"
      />
    </div>
  );
};
