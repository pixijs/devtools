import { useCallback } from 'react';
import type { NodeApi } from 'react-arborist';
import { Button } from '../../../../components/ui/button';
import type { BridgeFn } from '../../../../lib/utils';
import { cn } from '../../../../lib/utils';
import type { SceneGraphEntry } from '../../../../types';
import { Toggle } from '../../../../components/ui/toggle';
import type { ButtonMetadata } from '@pixi/devtools';

// TypeScript: Define types for props
type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement> | ((value: boolean) => void);
  button: ButtonMetadata;
  icon?: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

const preventEventPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const NodeButton: React.FC<ButtonProps> = ({ button, onClick, icon, asChild, className }) => {
  if (button.type === 'toggle') {
    return (
      <Toggle
        asChild={asChild ?? false}
        variant={'outline'}
        size={'xs'}
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
      size={'xs'}
      variant={'outline'}
      className={cn('text-overflow-ellipsis overflow-hidden whitespace-nowrap px-1', className)}
      onDoubleClick={preventEventPropagation}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {icon ? icon : button.icon ?? button.name}
    </Button>
  );
};

export const CustomNodeButton: React.FC<
  Omit<ButtonProps, 'onClick'> & { node: NodeApi<SceneGraphEntry>; bridge: BridgeFn }
> = ({ node, button, bridge, icon, asChild, className }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | boolean) => {
      const action =
        typeof e === 'boolean'
          ? `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button.name)}, ${JSON.stringify(e)})`
          : `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button.name)})`;

      bridge(action);
      if (e instanceof MouseEvent) {
        e.stopPropagation();
      }
    },
    [node, button, bridge],
  );

  return <NodeButton onClick={handleClick} button={button} icon={icon} asChild={asChild} className={className} />;
};
