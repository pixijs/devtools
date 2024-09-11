import type React from 'react';
import { memo } from 'react';
import type { BaseInstruction } from './Instructions';
import { InstructionSection } from './shared/InstructionSection';

export const RenderGroupView: React.FC<BaseInstruction> = memo(({ drawTextures, type, action }) => {
  return (
    <div className="flex flex-col">
      <div className="items-left flex w-full flex-col justify-between gap-4">
        <div>
          Render groups are used to group instructions together. They can be used to optimise your scene by reducing the
          amount of instruction rebuilds that need to be done.
          <br />
          <br />
          You can learn more about render groups{' '}
          <a
            href="https://pixijs.com/8.x/guides/advanced/render-groups"
            className="text-primary underline"
            target="_blank"
          >
            here
          </a>
        </div>
        <InstructionSection type={type} action={action} drawTextures={drawTextures} />
      </div>
    </div>
  );
});
