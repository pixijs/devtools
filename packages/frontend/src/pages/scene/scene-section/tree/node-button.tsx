import { useCallback } from 'react';
import type { NodeApi } from 'react-arborist';
import { Button } from '../../../../components/ui/button';
import type { BridgeFn } from '../../../../lib/utils';
import { cn } from '../../../../lib/utils';
import type { SceneGraphEntry } from '../../../../types';
import { Toggle } from '../../../../components/ui/toggle';

export const NodeButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  button: string;
  icon?: React.ReactNode;
}> = ({ button, onClick, icon }) => {
  return (
    <Button
      size={'xs'}
      variant={'outline'}
      className="text-overflow-ellipsis overflow-hidden whitespace-nowrap px-1"
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
      onClick={onClick}
    >
      {icon ? icon : button}
    </Button>
  );
};

export const CustomNodeButton: React.FC<{
  node: NodeApi<SceneGraphEntry>;
  button: string;
  bridge: BridgeFn;
  icon?: React.ReactNode;
}> = ({ node, button, bridge, icon }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();
      bridge(
        `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button)})`,
      );
    },
    [node, button, bridge],
  );

  return <NodeButton onClick={handleClick} button={button} icon={icon} />;
};

export const NodeToggleButton: React.FC<{
  onClick: (value: boolean) => void;
  button: string;
  icon?: React.ReactNode;
  value: boolean;
  asChild?: boolean;
  className?: string;
}> = ({ button, onClick, icon, value, asChild, className }) => {
  return (
    <Toggle
      asChild={asChild ?? false}
      variant={'outline'}
      size={'xs'}
      className={cn('text-overflow-ellipsis overflow-hidden whitespace-nowrap px-1', className)}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onPressedChange={onClick}
      pressed={value}
    >
      {icon ? icon : button}
    </Toggle>
  );
};

export const CustomNodeToggleButton: React.FC<{
  node: NodeApi<SceneGraphEntry>;
  button: string;
  bridge: BridgeFn;
  icon?: React.ReactNode;
  value: boolean;
  asChild?: boolean;
  className?: string;
}> = ({ node, button, bridge, icon, value, asChild, className }) => {
  const handleClick = useCallback(
    (pressed: boolean) => {
      bridge(
        `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button)}, ${JSON.stringify(pressed)})`,
      );
    },
    [node, button, bridge],
  );

  return (
    <NodeToggleButton
      onClick={handleClick}
      button={button}
      icon={icon}
      value={value}
      asChild={asChild}
      className={className}
    />
  );
};
