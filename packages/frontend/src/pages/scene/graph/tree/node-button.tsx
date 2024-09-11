import { useCallback } from 'react';
import type { NodeApi } from 'react-arborist';
import { Button } from '../../../../components/ui/button';
import type { BridgeFn } from '../../../../lib/utils';
import { cn } from '../../../../lib/utils';
import type { SceneGraphEntry } from '../../../../types';
import { Toggle } from '../../../../components/ui/toggle';
import type { ButtonMetadata } from '@pixi/devtools';

// TypeScript: Define types for props
export type NodeButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement> | ((value: boolean) => void);
  button: ButtonMetadata;
  icon?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
};

const preventEventPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const NodeButton: React.FC<NodeButtonProps> = ({ button, onClick, icon, asChild, className, size, variant }) => {
  if (button.type === 'toggle') {
    return (
      <Toggle
        asChild={asChild ?? false}
        variant={variant ?? 'outline'}
        size={size ?? 'xs'}
        className={cn('text-overflow-ellipsis overflow-hidden whitespace-nowrap px-1', className)}
        onDoubleClick={preventEventPropagation}
        onClick={preventEventPropagation}
        onPressedChange={onClick as (value: boolean) => void}
        pressed={button.value}
      >
        {icon ? icon : button.icon ?? button.name}
      </Toggle>
    );
  }

  return (
    <Button
      asChild={asChild ?? false}
      size={size ?? 'xs'}
      variant={variant ?? 'outline'}
      className={cn('text-overflow-ellipsis overflow-hidden whitespace-nowrap px-1', className)}
      onDoubleClick={preventEventPropagation}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {icon ? icon : button.icon ?? button.name}
    </Button>
  );
};

export const CustomNodeButton: React.FC<
  Omit<NodeButtonProps, 'onClick'> & { node: NodeApi<SceneGraphEntry>; bridge: BridgeFn }
> = ({ node, button, bridge, icon, asChild, className }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | boolean) => {
      const action =
        typeof e === 'boolean'
          ? `window.__PIXI_DEVTOOLS_WRAPPER__?.scene.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button.name)}, ${JSON.stringify(e)})`
          : `window.__PIXI_DEVTOOLS_WRAPPER__?.scene.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button.name)})`;

      bridge(action);
      if (e instanceof MouseEvent) {
        e.stopPropagation();
      }
    },
    [node, button, bridge],
  );

  return <NodeButton onClick={handleClick} button={button} icon={icon} asChild={asChild} className={className} />;
};
