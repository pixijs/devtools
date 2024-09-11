import type React from 'react';
import { memo } from 'react';
import { propertyMap } from '../../../components/properties/propertyTypes';
import { cn } from '../../../lib/utils';
import { TextureViewer } from '../../assets/gpuTextures/TextureViewer';
import type { BatchInstruction } from './Instructions';
import { InstructionSection } from './shared/InstructionSection';
import { PropertyEntries } from './shared/PropertyDisplay';

export const BatchView: React.FC<BatchInstruction> = memo(
  ({ textures, blendMode, start, size, drawTextures, action, type }) => {
    return (
      <div className="flex flex-col">
        <div className="items-left flex w-full flex-col justify-between">
          <InstructionSection type={type} action={action} drawTextures={drawTextures}>
            <PropertyEntries renderable={{ start, size, blendMode }} propertyMap={propertyMap} />
            {textures.length > 0 && (
              <div className={cn('flex h-full items-center pt-1', '')}>
                <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs">In Batch</div>
                <div className="ml-2 flex flex-row flex-wrap gap-2 py-1">
                  {textures.map((t, i) => (
                    <TextureViewer
                      key={i + 'bt'}
                      name={t.name}
                      blob={t.blob ?? ''}
                      selected={false}
                      pixelWidth={t.pixelWidth}
                      pixelHeight={t.pixelHeight}
                      isLoaded={true}
                      gpuSize={t.gpuSize}
                    />
                  ))}
                </div>
              </div>
            )}
          </InstructionSection>
        </div>
      </div>
    );
  },
);
