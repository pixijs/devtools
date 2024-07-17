import { useCallback } from 'react';
import type { NodeRendererProps } from 'react-arborist';
import { useDevtoolStore } from '../../../../App';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '../../../../components/ui/context-menu';
import type { SceneGraphEntry } from '../../../../types';
import { CustomNodeContextMenuItem, NodeContextMenuItem } from './context-menu-button';
import { NodeTrigger } from './node-trigger';

export function Node({ node, style, dragHandle }: NodeRendererProps<SceneGraphEntry>) {
  const bridge = useDevtoolStore.use.bridge()!;

  const onToggle = useCallback(() => {
    node.isInternal && node.toggle();
  }, [node]);

  const onSelected = useCallback(() => {
    node.tree.select(node);
  }, [node]);

  const onDeleted = useCallback(() => {
    if (!node.parent || node.data.metadata.locked) return;
    node.tree.delete(node);
  }, [node]);

  const onRename = useCallback(() => {
    setTimeout(() => {
      if (node.data.metadata.locked) return;
      node.tree.edit(node);
    }, 200);
  }, [node]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <NodeTrigger dragHandle={dragHandle} style={style} node={node} onToggle={onToggle} bridge={bridge} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <NodeContextMenuItem title="Select" onClick={onSelected} />
        <NodeContextMenuItem title="Rename" onClick={onRename} />
        <NodeContextMenuItem title="Toggle" onClick={onToggle} />
        <NodeContextMenuItem title="Delete" onClick={onDeleted} />
        {node.data.metadata.contextMenu?.map((item, i) => (
          <CustomNodeContextMenuItem
            key={node.id + item + i}
            node={node}
            item={item}
            bridge={bridge}
            isLast={i === node.data.metadata.contextMenu!.length - 1}
          />
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
