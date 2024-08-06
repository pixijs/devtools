import { useDevtoolStore } from '../../App';
import { SaveCollapsibleSection } from '../../components/collapsible/collapsible-section';
import { CanvasStatComponent } from '../../components/smooth-charts/stat';
import { useInterval } from '../../lib/interval';
import { formatCamelCase, isDifferent } from '../../lib/utils';
import type { RenderingState } from './rendering';
import { useTheme } from '../../components/theme-provider';

export const RenderingStats: React.FC = () => {
  const { theme } = useTheme();
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
                  <CanvasStatComponent
                    title={formatCamelCase(key)}
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
    </SaveCollapsibleSection>
  );
};
