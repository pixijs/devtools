import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import TreeView, { flattenTree } from 'react-accessible-treeview';
import {
  FaPlus as LayerIconClosed,
  FaMinus as LayerIconOpen,
  // FaArrowPointer as PickIcon,
  FaRegObjectGroup as SceneNodeIcon,
  FaWandMagicSparkles as PickIcon,
} from 'react-icons/fa6';
import { LuBoxSelect as OutlineToggleIcon } from 'react-icons/lu';
import { useDevtoolStore } from '../../../App';
import { Separator } from '../../../components/ui/separator';
import { Toggle } from '../../../components/ui/toggle';
import { cn } from '../../../lib/utils';

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
            <Toggle
              variant="ghost"
              size="icon"
              className="hover:border-primary h-8 rounded-none hover:border-b-2"
              defaultPressed={overlayPickerEnabled}
              onPressedChange={onPickerToggle}
            >
              <PickIcon className="dark:fill-white" />
            </Toggle>
            <Separator orientation="vertical" className="h-4" />
            <Toggle
              variant="ghost"
              size="icon"
              className="hover:border-primary h-8 rounded-none hover:border-b-2"
              defaultPressed={overlayHighlightEnabled}
              onPressedChange={onHighlightToggle}
            >
              <OutlineToggleIcon className="stroke-[3] dark:fill-white" />
            </Toggle>
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
            <div className="min-w-max text-sm">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const FolderIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) =>
  isOpen ? <LayerIconOpen className="ml-2" /> : <LayerIconClosed className="ml-2" />;

type FlattenTreeData = ReturnType<typeof flattenTree>;
function findParents(flattenTreeData: FlattenTreeData, selectedNode: FlattenTreeData[0]) {
  if (!selectedNode) return [];
  const parents = [] as FlattenTreeData;
  let currentParentId = selectedNode.parent;

  while (currentParentId) {
    const parent = flattenTreeData.find((node) => node.id === currentParentId);
    if (!parent) break;
    if (parent.id === 'root') break;
    parents.push(parent);
    currentParentId = parent.parent;
  }

  return parents;
}

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function createFuse(treeData: FlattenTreeData) {
  return new Fuse<FlattenTreeData[0]>(clone(treeData), {
    keys: ['name'],
    includeScore: true,
    findAllMatches: false,
    threshold: 0.2,
  });
}

export const Tree: React.FC = () => {
  const bridge = useDevtoolStore.use.bridge()!;
  const sceneGraph = useDevtoolStore.use.sceneGraph();
  const selectedNode = useDevtoolStore.use.selectedNode();
  const setSelectedNode = useDevtoolStore.use.setSelectedNode();

  const treeData = useMemo(() => flattenTree(clone(sceneGraph)), [sceneGraph]);
  const fuse = useMemo(() => createFuse(treeData), [treeData]);
  const [currentSearch, setCurrentSearch] = useState('');

  const highlightedNodes = useMemo(() => {
    if (currentSearch !== '') {
      const result = fuse.search(currentSearch);
      return result.map((item) => item.item.id) as string[];
    }
    return [];
  }, [currentSearch, fuse]);
  const highlightedTreeIds = useMemo(() => {
    if (currentSearch !== '') {
      const allNodes = treeData.map((node) => node.id as string);
      allNodes.shift();
      return allNodes;
    }
    return null;
  }, [currentSearch, treeData]);

  const selectedTreeId = useMemo(() => {
    const node = treeData.find((node) => node.metadata!.uid === selectedNode);
    const parents = findParents(treeData, node!);
    return node ? [node.id as number, ...parents.map((node) => node.id as number)] : null;
  }, [selectedNode, treeData]);

  const onSearch = (searchTerm: string) => {
    setCurrentSearch(searchTerm);
  };

  useEffect(() => {
    return () => {
      setSelectedNode(null);
    };
  }, [sceneGraph, bridge, setSelectedNode]);

  console.log('selectedTreeId', selectedTreeId, highlightedTreeIds);

  return (
    <Panel onSearch={onSearch}>
      <TreeView
        data={treeData}
        aria-label="directory tree"
        clickAction="EXCLUSIVE_SELECT"
        multiSelect={false}
        // TODO: setting expandedIds to undefined after already defining it does not reapply the defaultExpandedIds, causing the tree to collapse
        expandedIds={highlightedTreeIds ?? undefined}
        defaultExpandedIds={selectedTreeId!}
        defaultSelectedIds={selectedTreeId ? [selectedTreeId[0]] : []}
        nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => {
          const isHighlighted = highlightedNodes?.includes(element.id as string) ?? false;
          const nodeProps = getNodeProps();
          const nodeClasses = cn(nodeProps.className, isHighlighted && 'bg-secondary/20 text-white');
          return (
            <div
              {...nodeProps}
              className={nodeClasses}
              style={{ paddingLeft: 20 * (level - 1), paddingTop: 1, paddingBottom: 1 }}
              onMouseEnter={() => {
                bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.overlay.highlight(${JSON.stringify(element.metadata!.uid)})`);
              }}
              onMouseLeave={() => {
                bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.overlay.highlight()`);
              }}
            >
              {isBranch ? <FolderIcon isOpen={isExpanded} /> : <SceneNodeIcon className="icon" />}
              {element.name}
            </div>
          );
        }}
        onNodeSelect={(node) => {
          const selectedNodeIds = node.treeState!.selectedIds;
          console.log(node.treeState);
          const selectedNodes = treeData.filter((node) => selectedNodeIds.has(node.id));
          bridge(
            `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.setSelected(${JSON.stringify(
              selectedNodes.map((node) => node.metadata!.uid)[0],
            )})`,
          );
        }}
      />
    </Panel>
  );
};
