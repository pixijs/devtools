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
  console.log('renderable', renderable);
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
            <div className="ml-2 text-sm text-white">
              <div className="text-lg">Geometry</div>
              <div
                className="flex flex-row flex-wrap gap-2 pt-4"
                style={{
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                Indices: {formatFloat32Array(renderable.geometry.indices)}
              </div>
              <div
                className="flex flex-row flex-wrap gap-2 pt-4"
                style={{
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                UVs: {formatFloat32Array(renderable.geometry.uvs)}
              </div>
              <div
                className="flex flex-row flex-wrap gap-2 pt-4"
                style={{
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                Positions: {formatFloat32Array(renderable.geometry.positions)}
              </div>
            </div>
            <div className="text-lg">State</div>
            <PropertyEntries renderable={renderable.state} propertyMap={propertyMap} />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
});
