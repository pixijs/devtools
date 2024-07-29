import { useEffect, useState } from 'react';
import { FaCircleDot as CaptureIcon } from 'react-icons/fa6';
import { useDevtoolStore } from '../../App';
import { CollapsibleSection } from '../../components/collapsible/collapsible-section';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Separator } from '../../components/ui/separator';
import { Instructions } from './instructions/Instructions';
import type { RenderingState } from './rendering';
import { RenderingStats } from './RenderingStats';

export const RenderingPanel = () => {
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const bridge = useDevtoolStore.use.bridge();
  const captureWithScreenshot = useDevtoolStore.use.captureWithScreenshot();
  const setCaptureWithScreenshot = useDevtoolStore.use.setCaptureWithScreenshot();
  const setFrameCaptureData = useDevtoolStore.use.setFrameCaptureData();
  const setSelectedInstruction = useDevtoolStore.use.setSelectedInstruction();

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
        <div className="flex flex-grow items-center justify-center text-2xl dark:text-white">
          This panel is only available for PixiJS 8 and above
        </div>
      </div>
    );
  }

  const onCapture = async () => {
    setLoading(true);
    const res = await bridge!(`window.__PIXI_DEVTOOLS_WRAPPER__.rendering.capture(${captureWithScreenshot})`);
    setSelectedInstruction(null);
    setFrameCaptureData(res as RenderingState['frameCaptureData']);
    setLoading(false);
  };

  // const onPause = async () => {
  //   await bridge!('window.__PIXI_DEVTOOLS_WRAPPER__.rendering.pauseRenderer()');
  // };

  const onCaptureWithScreenshot = async (checked: boolean) => {
    setCaptureWithScreenshot(checked);
  };

  return (
    <div className="flex flex-grow flex-col overflow-hidden">
      <RenderingStats />
      <CollapsibleSection title={'Inspector'}>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex flex-col">
            <div className="border-border flex h-8 max-h-8 items-center gap-2 border-b">
              <div className="flex h-8 max-h-8 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:border-primary h-full w-full rounded-none hover:border-b-2"
                  onClick={onCapture}
                >
                  <div className="flex items-center space-x-2 px-2">
                    <CaptureIcon className="dark:fill-white" />
                    <div>Capture</div>
                  </div>
                </Button>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="screenshot"
                  defaultChecked={captureWithScreenshot}
                  onCheckedChange={onCaptureWithScreenshot}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Capture Draw Call Screenshot
                </label>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-grow items-center justify-center text-2xl dark:text-white">Capturing...</div>
          ) : (
            <Instructions />
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
};
