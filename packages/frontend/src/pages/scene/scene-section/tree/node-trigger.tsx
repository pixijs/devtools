import type { NodeApi } from 'react-arborist';
import {
  FaPlus as LayerIconClosed,
  FaMinus as LayerIconOpen,
  FaRegObjectGroup as SceneNodeIcon,
} from 'react-icons/fa6';
import { Input } from '../../../../components/ui/input';
import type { BridgeFn } from '../../../../lib/utils';
import { cn } from '../../../../lib/utils';
import type { SceneGraphEntry } from '../../../../types';
import { CustomNodeButton } from './node-button';

const NodeInput: React.FC<{ node: NodeApi<SceneGraphEntry> }> = ({ node }) => {
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
};

const FolderArrow: React.FC<{ node: NodeApi<SceneGraphEntry> }> = ({ node }) => {
  if (node.isLeaf)
    return (
      <span>
        <SceneNodeIcon />
      </span>
    );
  return <span>{node.isOpen ? <LayerIconOpen /> : <LayerIconClosed />}</span>;
};

export const NodeTrigger: React.FC<{
  dragHandle: ((el: HTMLDivElement | null) => void) | undefined;
  style: React.CSSProperties;
  node: NodeApi<SceneGraphEntry>;
  onToggle: () => void;
  bridge: BridgeFn;
}> = ({ dragHandle, style, node, onToggle, bridge }) => {
  return (
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
      <div className="flex items-center gap-1">
        {node.data.metadata.buttons?.map((button, i) => (
          <CustomNodeButton key={node.id + button + i} node={node} button={button} bridge={bridge} />
        ))}
      </div>
    </div>
  );
};
