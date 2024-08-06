import type React from 'react';
import { memo } from 'react';
import { FaCircle as CircleIcon } from 'react-icons/fa';
import { cn } from '../../../../lib/utils';
import { Texture } from './Texture';

// - instruction pill rules
//   - circle dot color that matches the render group its a part of
//   - red outline if its a draw call - show blue if renderBatch
//   - secondary outline if hovered
//   - primary outline if selected
//   - show type, action, draw texture (if exists)
export interface InstructionPillProps {
  onClick: () => void;
  selected: boolean;
  renderGroupColor: string;
  drawTextures?: string[];
  type: string;
  action: string;
  isDrawCall?: boolean;
}
export const InstructionPill: React.FC<InstructionPillProps> = memo(
  ({ onClick, selected, renderGroupColor, drawTextures, type, action, isDrawCall }) => {
    const border = selected ? 'bg-primary' : isDrawCall ? 'border-primary' : '';
    const text = selected ? 'text-white' : '';
    return (
      <div
        className={cn(
          `hover:bg-secondary bg-border flex cursor-pointer flex-row items-center justify-center gap-1 rounded-sm border p-1`,
          'min-w-52',
          border,
        )}
        onClick={onClick}
      >
        <div className="ml-2 flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-lg">
          <CircleIcon className={cn(`h-4 w-4`, renderGroupColor)} />
        </div>
        <div className={cn(text, `flex w-full flex-col justify-between gap-2 pl-2 dark:text-white`)}>
          <div className="pl-2 text-sm">Type: {type}</div>
          <div className="pl-2 text-sm">Action: {action}</div>
          {drawTextures && drawTextures.map((texture, i) => <Texture key={i + 'bt'} texture={texture} />)}
        </div>
      </div>
    );
  },
);
