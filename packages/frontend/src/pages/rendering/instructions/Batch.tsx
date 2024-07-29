import type React from 'react';
import { memo } from 'react';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { propertyMap } from '../../../components/properties/propertyTypes';
import { TextureViewer } from '../../assets/gpuTextures/TextureViewer';
import type { BatchInstruction } from './Instructions';
import { PropertyEntries } from './shared/PropertyDisplay';
import { Texture } from './shared/Texture';

export const BatchView: React.FC<BatchInstruction> = memo(
  ({ textures, blendMode, start, size, drawTextures, action, type }) => {
    return (
      <div className="flex flex-col">
        <div className="items-left flex w-full flex-col justify-between">
          <CollapsibleSection key={'instruction'} title={'Instruction'} className="border-x">
            <div className="flex flex-col px-2 py-1 [&>*:first-child]:pt-0">
              <PropertyEntries renderable={{ type, action, start, size, blendMode }} propertyMap={propertyMap} />
              {textures && (
                // center the texture viewer
                <div className="pt-1">
                  <label className="pr-14 text-xs">In Batch</label>
                  <div className="flex flex-wrap gap-2 pt-2">
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
              {drawTextures.length > 0 && (
                <>
                  <div className="ml-2 text-sm text-white">Draw Call Textures</div>
                  <div className="ml-2 flex flex-row flex-wrap gap-2">
                    {drawTextures.map((texture, i) => (
                      <Texture key={i + 'bt'} texture={texture} size={64} border={'border-border'} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </CollapsibleSection>
        </div>
      </div>
    );
  },
);
