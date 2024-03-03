import { useDevtoolStore } from '../../../App';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { Toggle } from '../../../components/ui/toggle';
import { cn } from '../../../lib/utils';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import TreeView, { flattenTree } from 'react-accessible-treeview';
import {
  FaGear,
  FaPlus as LayerIconClosed,
  FaMinus as LayerIconOpen,
  FaRegObjectGroup as SceneNodeIcon,
} from 'react-icons/fa6';
import { FaArrowPointer as PickIcon } from 'react-icons/fa6';

interface PanelProps {
  children: React.ReactNode;
  onSearch?: (searchTerm: string) => void;
}
const Panel: React.FC<PanelProps> = ({ children, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

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
            <Separator orientation="vertical" className="h-4" />
            <Toggle variant="ghost" size="icon" className="hover:border-primary h-8 rounded-none hover:border-b-2">
              <PickIcon className="dark:fill-white" />
            </Toggle>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="icon" className="hover:border-primary h-8 rounded-none hover:border-b-2">
              <FaGear className="dark:fill-white" />
            </Button>
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

export const Tree: React.FC = () => {
  const bridge = useDevtoolStore.use.bridge()!;
  const sceneGraph = useDevtoolStore.use.sceneGraph();
  const selectedNode = useDevtoolStore.use.selectedNode();

  const treeData = flattenTree(sceneGraph as unknown as typeof flattenTree);

  // find the node in the tree data that matches the selected node
  const node = treeData.find((node) => node.metadata!.uid === selectedNode);
  const parents = findParents(treeData, node!);
  const [selectedTreeId, setSelectedTreeId] = useState<number[] | null>(
    node ? [node.id as number, ...parents.map((node) => node.id as number)] : null,
  );

  const fuse = useMemo(
    () =>
      new Fuse(treeData, {
        keys: ['name'],
        includeScore: true,
        findAllMatches: false,
        threshold: 0.1,
      }),
    [treeData],
  );
  const [highlightedNodes, setHighlightedNodes] = useState<string[] | null>([]);
  const [highlightedTreeIds, setHighlightedTreeIds] = useState<string[] | null>(null);

  const onSearch = (searchTerm: string) => {
    if (searchTerm === '') {
      setHighlightedNodes(null);
      setHighlightedTreeIds(null);
      return;
    }
    const result = fuse.search(searchTerm);
    const highlightedNodes = result.map((item) => item.item.id) as string[];
    setHighlightedNodes(highlightedNodes);
    // TODO: expanding the entire tree for now, should only expand the nodes that are highlighted
    const allNodes = treeData.map((node) => node.id as string);
    allNodes.shift();
    setHighlightedTreeIds(allNodes);
  };

  useEffect(() => {
    return () => {
      setHighlightedNodes(null);
      setHighlightedTreeIds(null);
    };
  }, [sceneGraph]);

  console.log('expandedIds', selectedTreeId);

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
            >
              {isBranch ? <FolderIcon isOpen={isExpanded} /> : <SceneNodeIcon className="icon" />}
              {element.name}
            </div>
          );
        }}
        onSelect={(node) => {
          const selectedNodeIds = node.treeState.selectedIds;
          const selectedNodes = treeData.filter((node) => selectedNodeIds.has(node.id));
          bridge(
            `window.__PIXI_DEVTOOLS_WRAPPER__.properties.setSelectedNodeIds(${JSON.stringify(
              selectedNodes.map((node) => node.metadata!.uid)[0],
            )})`,
          );

          const id = [...selectedNodeIds][0];
          if (!selectedTreeId || selectedTreeId[0] !== id) {
            setSelectedTreeId([id as number]);
          }
        }}
      />
    </Panel>
  );
};
