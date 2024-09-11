import type React from 'react';
import { memo } from 'react';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { propertyMap } from '../../../components/properties/propertyTypes';
import { TextureViewer } from '../../assets/gpuTextures/TextureViewer';
import type { MeshInstruction } from './Instructions';
import { InstructionSection } from './shared/InstructionSection';
import { PropertyEntries } from './shared/PropertyDisplay';
import { Shader } from './shared/Shader';

export const MeshView: React.FC<MeshInstruction> = memo(({ renderable, drawTextures, type, action }) => {
  const formatFloat32Array = (array: number[]) => {
    return `[${array.join(', ')}]`;
  };

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
            <PropertyEntries
              renderable={renderable}
              propertyMap={propertyMap}
              ignore={['texture', 'program', 'geometry', 'state']}
            />
            <Shader vertex={renderable.program.vertex ?? ''} fragment={renderable.program.fragment ?? ''} />
            <div className="flex h-full items-center pt-4">
              <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs dark:text-white">Indices</div>
              <div className="border-border max-h-48 w-full overflow-auto rounded-sm border p-2">
                {formatFloat32Array(renderable.geometry.indices)}
              </div>
            </div>
            <div className="flex h-full items-center pt-4">
              <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs dark:text-white">UVs</div>
              <div className="border-border max-h-48 w-full overflow-auto rounded-sm border p-2">
                {formatFloat32Array(renderable.geometry.uvs)}
              </div>
            </div>
            <div className="flex h-full items-center pt-2">
              <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs dark:text-white">Positions</div>
              <div className="border-border max-h-48 w-full overflow-auto rounded-sm border p-2">
                {formatFloat32Array(renderable.geometry.positions)}
              </div>
            </div>
            <PropertyEntries renderable={renderable.state} propertyMap={propertyMap} />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
});
