import React, { useEffect, useState } from 'react';
import TreeView, { flattenTree } from 'react-accessible-treeview';
import {
  // FaLayerGroup as ContainerIcon,
  FaRegObjectGroup as SceneNodeIcon,
  FaPlus as LayerIconClosed,
  FaMinus as LayerIconOpen,
  FaFileImage as SpriteIcon,
} from 'react-icons/fa6';
import { SectionHeader, Title, TitleGroup } from '../Container';

import { usePixiStore } from '@lib/pages';
import { TreeDirectory, TreeWrapper } from './styles';

type FlattenTreeData = ReturnType<typeof flattenTree>;

function findParents(flattenTreeData: FlattenTreeData, selectedNode: FlattenTreeData[0]) {
  if (!selectedNode) return [];
  const parents = [] as FlattenTreeData;
  let currentParentId = selectedNode.parent;

  while (currentParentId) {
    const parent = flattenTreeData.find((node) => node.id === currentParentId);
    if (!parent) break;

    parents.push(parent);
    currentParentId = parent.parent;
  }

  return parents;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TreeViewComponentProps {}
const TreeViewComponent: React.FC<TreeViewComponentProps> = () => {
  const bridge = usePixiStore((state) => state.bridge);
  const sceneGraph = usePixiStore((state) => state.sceneGraph);
  const flattenTreeData = flattenTree(sceneGraph as any);
  const selectedNodeId = usePixiStore((state) => state.selectedNodeId);
  const setSelectedNodeId = usePixiStore((state) => state.setSelectedNodeId);

  // find the node in the flattenTreeData that matches the selectedNodeId
  const selectedNode = flattenTreeData.find((node) => node.metadata!.uid === selectedNodeId);
  const parents = findParents(flattenTreeData, selectedNode!);
  const [treeId, setTreeId] = useState<number[] | null>(
    selectedNode ? [selectedNode.id as number, ...parents.map((node) => node.id as number)] : null,
  );

  useEffect(() => {
    return () => {
      setSelectedNodeId(null);
      setTreeId(null);
    };
  }, []);

  console.log('rendering tree', selectedNodeId);
  return (
    <TreeWrapper>
      <SectionHeader style={{ paddingRight: 0 }}>
        <TitleGroup>
          <Title style={{ fontSize: '14px' }}>Tree</Title>
        </TitleGroup>
        <div>
          <TreeDirectory>
            <TreeView
              data={flattenTreeData}
              aria-label="directory tree"
              clickAction="EXCLUSIVE_SELECT"
              multiSelect={false}
              defaultExpandedIds={treeId!}
              defaultSelectedIds={treeId ? [treeId[0]] : []}
              nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
                <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1), paddingTop: 1, paddingBottom: 1 }}>
                  {isBranch ? <FolderIcon isOpen={isExpanded} /> : <FileIcon filename={element.name} />}
                  {element.name}
                </div>
              )}
              onSelect={(node) => {
                const selectedNodeIds = node.treeState.selectedIds;
                // loop through the flattenTreeData and find the nodes that are selected
                const selectedNodes = flattenTreeData.filter((node) => selectedNodeIds.has(node.id));
                bridge(
                  `window.__PIXI_DEVTOOLS_WRAPPER__.properties.setSelectedNodeIds(${JSON.stringify(
                    selectedNodes.map((node) => node.metadata!.uid)[0],
                  )})`,
                );

                const id = [...selectedNodeIds][0];
                if (!treeId || treeId[0] !== id) {
                  setTreeId([id as number]);
                }
              }}
            />
          </TreeDirectory>
        </div>
      </SectionHeader>
    </TreeWrapper>
  );
};

const FolderIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) =>
  isOpen ? <LayerIconOpen className="icon container open" /> : <LayerIconClosed className="icon container closed" />;

const FileIcon: React.FC<{ filename: string }> = ({ filename }) => {
  if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
    return <SpriteIcon color="white" className="icon" />;
  }

  return <SceneNodeIcon color="white" className="icon" />;
};

export default TreeViewComponent;
