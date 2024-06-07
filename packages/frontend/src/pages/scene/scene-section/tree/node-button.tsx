import { useCallback } from 'react';
import type { NodeApi } from 'react-arborist';
import { Button } from '../../../../components/ui/button';
import type { BridgeFn } from '../../../../lib/utils';
import type { SceneGraphEntry } from '../../../../types';
import { Toggle } from '../../../../components/ui/toggle';

export const NodeButton: React.FC<{ onClick: React.MouseEventHandler<HTMLButtonElement>; button: string }> = ({
  button,
  onClick,
}) => {
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
      {button}
    </Button>
  );
};

export const CustomNodeButton: React.FC<{ node: NodeApi<SceneGraphEntry>; button: string; bridge: BridgeFn }> = ({
  node,
  button,
  bridge,
}) => {
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

  return <NodeButton onClick={handleClick} button={button} />;
};

export const NodeToggleButton: React.FC<{
  onClick: (value: boolean) => void;
  button: string;
}> = ({ button, onClick }) => {
  return (
    <Toggle
      variant={'outline'}
      size={'xs'}
      className="text-overflow-ellipsis overflow-hidden whitespace-nowrap px-1"
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onPressedChange={onClick}
      defaultPressed={true}
    >
      {button}
    </Toggle>
  );
};

export const CustomNodeToggleButton: React.FC<{
  node: NodeApi<SceneGraphEntry>;
  button: string;
  bridge: BridgeFn;
}> = ({ node, button, bridge }) => {
  const handleClick = useCallback(
    (pressed: boolean) => {
      bridge(
        `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.nodeButtonPress(${JSON.stringify(node.id)}, ${JSON.stringify(button)}, ${JSON.stringify(pressed)})`,
      );
    },
    [node, button, bridge],
  );

  return <NodeToggleButton onClick={handleClick} button={button} />;
};
