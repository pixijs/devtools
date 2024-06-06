import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../../../components/ui/context-menu';
import type { NodeApi, NodeRendererProps } from 'react-arborist';
import {
  FaPlus as LayerIconClosed,
  FaMinus as LayerIconOpen,
  FaRegObjectGroup as SceneNodeIcon,
} from 'react-icons/fa6';
import { cn } from '../../../../lib/utils';
import type { SceneGraphEntry } from '../../../../types';
import { Input } from '../../../../components/ui/input';
import { useDevtoolStore } from '../../../../App';
import { Button } from '../../../../components/ui/button';

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

      bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.tree.setSelected(${JSON.stringify(node.id)})`);
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
          className={cn('mb-1 flex h-full min-w-max items-center gap-2 leading-5', node.state)}
          onDoubleClick={onToggle}
          onMouseEnter={() => {
            bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.overlay.highlight(${JSON.stringify(node.id)})`);
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
          {/* a button that is placed to the right using flex */}
          <div className="flex-grow" />
          <div className="flex gap-1">
            {/* loop through all node metadata.buttons and create a small button */}
            {node.data.metadata.buttons?.map((button, i) => (
              <Button
                size={'xs'}
                variant={'outline'}
                className="text-overflow-ellipsis overflow-hidden whitespace-nowrap px-1"
                key={button + i}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  bridge(
                    `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button)})`,
                  );
                }}
              >
                {button}
              </Button>
            ))}
          </div>
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
        {/* loop through metadata.contextMenu and add buttons */}
        {node.data.metadata.contextMenu?.map((item, i) => {
          return (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                key={item + i}
                onClick={() => {
                  bridge(
                    `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeContextMenu(${JSON.stringify(node.id)}, ${JSON.stringify(item)})`,
                  );
                }}
              >
                {item}
              </ContextMenuItem>
            </>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}
