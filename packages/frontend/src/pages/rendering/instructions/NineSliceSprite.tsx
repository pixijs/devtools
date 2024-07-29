import type React from 'react';
import { memo } from 'react';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { propertyMap } from '../../../components/properties/propertyTypes';
import { TextureViewer } from '../../assets/gpuTextures/TextureViewer';
import type { NineSliceInstruction } from './Instructions';
import { InstructionSection } from './shared/InstructionSection';
import { PropertyEntries } from './shared/PropertyDisplay';

export const NineSliceSpriteView: React.FC<NineSliceInstruction> = memo(
  ({ renderable, drawTextures, type, action }) => {
    return (
      <div className="flex flex-col">
        <div className="items-left flex w-full flex-col justify-between">
          <InstructionSection type={type} action={action} drawTextures={drawTextures} />
          <CollapsibleSection key={'renderable'} title={'Renderable'} className="border-x">
            <div className="flex flex-col px-2 py-1 [&>*:first-child]:pt-0">
              {renderable.texture && (
                // center the texture viewer
                <div className="flex justify-center">
                  <TextureViewer
                    name={renderable.texture.name}
                    blob={renderable.texture.blob ?? ''}
                    selected={false}
                    pixelWidth={renderable.texture.pixelWidth}
                    pixelHeight={renderable.texture.pixelHeight}
                    isLoaded={true}
                    gpuSize={renderable.texture.gpuSize}
                  />
                </div>
              )}
              <PropertyEntries renderable={renderable} propertyMap={propertyMap} />
            </div>
          </CollapsibleSection>
        </div>
      </div>
    );
  },
);
