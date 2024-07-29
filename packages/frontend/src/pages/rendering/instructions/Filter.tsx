import type React from 'react';
import { memo } from 'react';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { propertyMap } from '../../../components/properties/propertyTypes';
import { TextureViewer } from '../../assets/gpuTextures/TextureViewer';
import type { FilterInstruction } from './Instructions';
import { InstructionSection } from './shared/InstructionSection';
import { PropertyEntries } from './shared/PropertyDisplay';
import { Shader } from './shared/Shader';
import { State } from './shared/State';

export const FilterView: React.FC<FilterInstruction> = memo(({ renderables, filter, drawTextures, type, action }) => {
  return (
    <div className="flex flex-col">
      <div className="items-left flex w-full flex-col justify-between">
        <InstructionSection type={type} action={action} drawTextures={drawTextures} />
        {filter?.map((filter, i) => (
          <CollapsibleSection key={i} title={`Filter (${filter.type})`} className="border-x">
            <div className="flex flex-col px-2 py-1 [&>*:first-child]:pt-0">
              <PropertyEntries renderable={filter} propertyMap={propertyMap} ignore={['program', 'state']} />
              <Shader vertex={filter.program.vertex} fragment={filter.program.fragment} />
              <State {...filter.state} />
            </div>
          </CollapsibleSection>
        ))}
        {renderables.map((renderable, i) => (
          <CollapsibleSection key={`${i} renderable`} title={`Renderable (${renderable.label}`} className="border-x">
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
        ))}
      </div>
    </div>
  );
});
