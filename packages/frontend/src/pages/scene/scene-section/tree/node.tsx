import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../../../components/ui/context-menu';
import { NodeApi, NodeRendererProps } from 'react-arborist';
import {
  FaPlus as LayerIconClosed,
  FaMinus as LayerIconOpen,
  FaRegObjectGroup as SceneNodeIcon,
} from 'react-icons/fa6';
import { cn } from '../../../../lib/utils';
import { SceneGraphEntry } from '../../../../types';
import { Input } from '../../../../components/ui/input';
import { useDevtoolStore } from '@devtool/frontend/App';

function NodeInput({ node }: { node: NodeApi<SceneGraphEntry> }) {
  return (
    <Input
      autoFocus
      type="text"
      defaultValue={node.data.name}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => node.reset()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') node.reset();
        if (e.key === 'Enter') node.submit(e.currentTarget.value);
      }}
      className="bg-background max-h-[22px]"
    />
  );
}

function FolderArrow({ node }: { node: NodeApi<SceneGraphEntry> }) {
  if (node.isLeaf)
    return (
      <span>
        <SceneNodeIcon />
      </span>
    );
  return <span>{node.isOpen ? <LayerIconOpen /> : <LayerIconClosed />}</span>;
}

export function Node({ node, style, dragHandle }: NodeRendererProps<SceneGraphEntry>) {
  const bridge = useDevtoolStore.use.bridge()!;
  const onToggle = () => {
    node.isInternal && node.toggle();
  };
  const onSelected = () => {
    node.tree.select(node);
  };
  const onDeleted = () => {
    if (!node.parent) return;
    node.tree.delete(node);
    setTimeout(() => {
      if (!node.parent) return;
      node.tree.select(node.parent);

      bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.tree.setSelected(${JSON.stringify(node.parent.data.metadata.uid)})`);
    }, 1);
  };
  const onRename = () => {
    setTimeout(() => {
      node.tree.edit(node);
    }, 200);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={dragHandle}
          style={style}
          className={cn('mb-1 flex h-full items-center gap-2 leading-5', node.state)}
          onDoubleClick={onToggle}
          onMouseEnter={() => {
            bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.overlay.highlight(${JSON.stringify(node.data.metadata.uid)})`);
          }}
          onMouseLeave={() => {
            bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.overlay.highlight()`);
          }}
        >
          <span onClick={onToggle}>
            <FolderArrow node={node} />
          </span>
          <span onClick={onToggle}>{node.isEditing ? <NodeInput node={node} /> : node.data.name}</span>
          <span>{node.data.metadata.suffix}</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onSelected}>Select</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onToggle}>Toggle</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDeleted}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
