import { useDevtoolStore } from '../../App';
import { SaveCollapsibleSection } from '../../components/collapsible/collapsible-section';
import { CanvasComponent } from '../../components/smooth-charts/stat';
import { useInterval } from '../../lib/interval';
import { formatCamelCase, isDifferent } from '../../lib/utils';
import type { RenderingState } from './rendering';

export const RenderingStats: React.FC = () => {
  const bridge = useDevtoolStore.use.bridge();
  const renderingData = useDevtoolStore.use.renderingData();
  const setRenderingData = useDevtoolStore.use.setRenderingData();

  useInterval(async () => {
    const res = await bridge!('window.__PIXI_DEVTOOLS_WRAPPER__.rendering.captureRenderingData()');

    if (isDifferent(res, renderingData)) {
      setRenderingData(res as RenderingState['renderingData']);
    }
  }, 100);

  return (
    <SaveCollapsibleSection title="Stats" storageKey="rendering:stats" defaultCollapsed={false}>
      <div className="flex h-[125px] max-h-[10%] overflow-auto">
        <div className="flex h-full w-full flex-wrap justify-start overflow-auto pb-4">
          {renderingData &&
            Object.keys(renderingData!).map((key) => {
              const item = renderingData![key as keyof typeof renderingData];
              return (
                <div className="h-fit px-2 pt-2" key={key}>
                  <CanvasComponent
                    title={formatCamelCase(key)}
                    bgColor={'#1D1E20'}
                    fgColor={'#E72264'}
                    lineColor="#441E2B"
                    value={item}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </SaveCollapsibleSection>
  );
};
