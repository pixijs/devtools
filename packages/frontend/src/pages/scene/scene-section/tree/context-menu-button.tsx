import { useCallback } from 'react';
import type { NodeApi } from 'react-arborist';
import { ContextMenuItem, ContextMenuSeparator } from '../../../../components/ui/context-menu';
import type { BridgeFn } from '../../../../lib/utils';
import type { SceneGraphEntry } from '../../../../types';
import type { ButtonMetadata } from '@pixi/devtools';

// TODO: convert to allow for toggle buttons
export const NodeContextMenuItem: React.FC<{
  title: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isLast?: boolean;
}> = ({ title, onClick, isLast }) => {
  isLast = isLast ?? false;
  return (
    <>
      <ContextMenuItem onClick={onClick}>{title}</ContextMenuItem>
      {!isLast && <ContextMenuSeparator />}
    </>
  );
};

export const CustomNodeContextMenuItem: React.FC<{
  node: NodeApi<SceneGraphEntry>;
  item: ButtonMetadata;
  bridge: BridgeFn;
  isLast?: boolean;
}> = ({ node, item, bridge, isLast }) => {
  const handleClick = useCallback(() => {
    bridge(
      `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeContextMenu(${JSON.stringify(node.id)}, ${JSON.stringify(item)})`,
    );
  }, [node, item, bridge]);

  return <NodeContextMenuItem title={item.icon ?? item.name} onClick={handleClick} isLast={isLast} />;
};
