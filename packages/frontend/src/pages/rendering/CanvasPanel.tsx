import { useDevtoolStore } from '../../App';
import { SaveCollapsibleSection } from '../../components/collapsible/collapsible-section';
import { propertyMap } from '../../components/properties/propertyTypes';
import { useInterval } from '../../lib/interval';
import { isDifferent } from '../../lib/utils';
import { PropertyEntries } from './instructions/shared/PropertyDisplay';
import type { CanvasData } from './rendering';

export const CanvasPanel = () => {
  const bridge = useDevtoolStore.use.bridge();
  const canvasData = useDevtoolStore.use.canvasData();
  const setCanvasData = useDevtoolStore.use.setCanvasData();

  useInterval(async () => {
    const res = await bridge!('window.__PIXI_DEVTOOLS_WRAPPER__.rendering.captureCanvasData()');
    if (isDifferent(res, canvasData)) {
      setCanvasData(res as CanvasData);
    }
  }, 2500);

  if (!canvasData) {
    return null;
  }

  return (
    <SaveCollapsibleSection title={'Renderer Info'} storageKey="rendering:canvasPanel" defaultCollapsed={false}>
      <div className="flex h-fit max-h-[25%] overflow-auto py-2">
        <div className="flex h-full w-full flex-col justify-start overflow-auto px-2 pb-4">
          <PropertyEntries renderable={canvasData} propertyMap={propertyMap} />
          {/* <div> width: {canvasData?.width} </div>
          <div> height: {canvasData?.height} </div>
          <div> clientWidth: {canvasData?.clientWidth} </div>
          <div> clientHeight: {canvasData?.clientHeight} </div>
          <div> browserAgent: {canvasData?.browserAgent} </div>
          <div> alpha: {canvasData?.context.alpha} </div>
          <div> antialias: {canvasData?.context.antialias} </div>
          <div> depth: {canvasData?.context.depth} </div>
          <div> preserveDrawingBuffer: {canvasData?.context.preserveDrawingBuffer} </div>
          <div> powerPreference: {canvasData?.context.powerPreference} </div>
          <div> premultipliedAlpha: {canvasData?.context.premultipliedAlpha} </div>
          <div> autoDensity: {canvasData?.renderer?.autoDensity} </div>
          <div> background: {canvasData?.renderer?.background} </div>
          <div> clearBeforeRender: {canvasData?.renderer?.clearBeforeRender} </div>
          <div> {canvasData?.renderer?.failIfMajorPerformanceCaveat} </div>
          <div> renderableGCActive: {canvasData?.renderer?.renderableGCActive} </div>
          <div> renderableGCFrequency: {canvasData?.renderer?.renderableGCFrequency} </div>
          <div> renderableGCMaxUnusedTime: {canvasData?.renderer?.renderableGCMaxUnusedTime} </div>
          <div> resolution: {canvasData?.renderer?.resolution} </div>
          <div> roundPixels: {canvasData?.renderer?.roundPixels} </div>
          <div> textureGCAMaxIdle: {canvasData?.renderer?.textureGCAMaxIdle} </div>
          <div> textureGCActive: {canvasData?.renderer?.textureGCActive} </div>
          <div> textureGCCheckCountMax: {canvasData?.renderer?.textureGCCheckCountMax} </div>
          <div> type: {canvasData?.renderer?.type} </div> */}
        </div>
      </div>
    </SaveCollapsibleSection>
  );
};
