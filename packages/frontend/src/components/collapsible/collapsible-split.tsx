import type { PanelProps } from 'react-resizable-panels';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { CollapsibleSection } from './collapsible-section';

interface CollapsibleSectionProps {
  left: React.ReactNode;
  right: React.ReactNode;
  rightOptions?: PanelProps;
  leftOptions?: PanelProps;
  title?: string;
}
export const CollapsibleSplit: React.FC<CollapsibleSectionProps> = ({
  title,
  left,
  right,
  rightOptions,
  leftOptions,
}) => {
  return (
    <CollapsibleSection title={title ?? 'Scene'}>
      <div className="flex h-full flex-1 overflow-hidden">
        <div className="relative bottom-0 right-0 w-full">
          <PanelGroup direction="horizontal">
            <Panel className="flex h-full overflow-auto" {...leftOptions}>
              {left}
            </Panel>
            <PanelResizeHandle className="bg-border w-0.5" />
            <Panel className="flex h-full overflow-auto" {...rightOptions}>
              {right}
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </CollapsibleSection>
  );
};
