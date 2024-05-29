import { useState } from 'react';
import { Tree } from 'react-arborist';
import { FaWandMagicSparkles as PickIcon } from 'react-icons/fa6';
import { LuBoxSelect as OutlineToggleIcon } from 'react-icons/lu';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useDevtoolStore } from '../../../App';
import { Separator } from '../../../components/ui/separator';
import { Toggle } from '../../../components/ui/toggle';
import { TooltipWrapper } from '../../../components/ui/tooltip';
import { Cursor } from './tree/cursor';
import { Node } from './tree/node';
import { useSimpleTree } from './tree/simple-tree';

interface PanelProps {
  children: React.ReactNode;
  onSearch?: (searchTerm: string) => void;
}
const Panel: React.FC<PanelProps> = ({ children, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const overlayPickerEnabled = useDevtoolStore.use.overlayPickerEnabled();
  const overlayHighlightEnabled = useDevtoolStore.use.overlayHighlightEnabled();
  const bridge = useDevtoolStore.use.bridge()!;

  const onPickerToggle = (enabled: boolean) => {
    bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.overlay.enablePicker(${enabled})`);
  };
  const onHighlightToggle = (enabled: boolean) => {
    bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.overlay.enableHighlight(${enabled})`);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <>
      <div className="relative left-0 top-0 w-full overflow-hidden">
        {/* panel wrapper */}
        <div className="flex h-full flex-col">
          {/* search bar */}
          <div className="border-border flex h-8 max-h-8 items-center border-b">
            <TooltipWrapper
              trigger={
                <Toggle
                  asChild
                  variant="ghost"
                  size="icon"
                  className="hover:border-primary h-8 rounded-none hover:border-b-2"
                  defaultPressed={overlayPickerEnabled}
                  pressed={overlayPickerEnabled}
                  onPressedChange={onPickerToggle}
                >
                  <div className="h-3 w-3">
                    <PickIcon className="h-3 dark:fill-white" />
                  </div>
                </Toggle>
              }
              tip="Allows you to select a node in the scene by clicking on it."
            />
            <Separator orientation="vertical" className="h-4" />
            <TooltipWrapper
              trigger={
                <Toggle
                  asChild
                  variant="ghost"
                  size="icon"
                  className="hover:border-primary h-8 rounded-none hover:border-b-2"
                  defaultPressed={overlayHighlightEnabled}
                  onPressedChange={onHighlightToggle}
                >
                  <div className="h-3 w-3">
                    <OutlineToggleIcon className="stroke-[3] dark:fill-white" />
                  </div>
                </Toggle>
              }
              tip="Highlight selected node in the scene, and the currently hovered node."
            />
            <Separator orientation="vertical" className="h-4" />
            {/* search wrapper */}
            <div className="hover:border-b-primary inline-block h-8 w-auto min-w-0 flex-1 cursor-text align-middle hover:border-b-2">
              <input
                type="text"
                placeholder="Search"
                className="h-8 w-full border-none bg-transparent p-2 outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          {/* content */}
          <div className="flex-1 overflow-auto p-2">
            <div className="h-full min-w-max text-sm">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SceneTree: React.FC = () => {
  const bridge = useDevtoolStore.use.bridge()!;
  const sceneGraph = useDevtoolStore.use.sceneGraph()!;
  const selectedNode = useDevtoolStore.use.selectedNode();
  const sceneGraphClone = JSON.parse(JSON.stringify(sceneGraph));
  const [data, controller] = useSimpleTree(bridge, sceneGraphClone);
  const [currentSearch, setCurrentSearch] = useState('');

  const onSearch = (searchTerm: string) => {
    setCurrentSearch(searchTerm);
  };

  return (
    <Panel onSearch={onSearch}>
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ height }) => (
          <Tree
            data={data}
            {...controller}
            width={'100%'}
            height={height}
            renderCursor={Cursor}
            searchTerm={currentSearch}
            selection={selectedNode ? selectedNode : undefined}
            openByDefault={false}
          >
            {Node}
          </Tree>
        )}
      </AutoSizer>
    </Panel>
  );
};
