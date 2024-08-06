import type React from 'react';
import { memo } from 'react';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { propertyMap } from '../../../components/properties/propertyTypes';
import type { MaskInstruction } from './Instructions';
import { PropertyEntries } from './shared/PropertyDisplay';

export const MaskView: React.FC<MaskInstruction> = memo(({ mask, type, action }) => {
  if (mask) {
    return (
      <div className="flex flex-col">
        <div className="items-left flex w-full flex-col justify-between">
          <CollapsibleSection key={'instruction'} title={'Instruction'} className="border-x">
            <div className="flex flex-col px-2 py-1 [&>*:first-child]:pt-0">
              <PropertyEntries renderable={{ type, action }} propertyMap={propertyMap} />
            </div>
          </CollapsibleSection>
          <CollapsibleSection key={'renderable'} title={'Renderable'} className="border-x">
            <div className="flex flex-col px-2 py-1 [&>*:first-child]:pt-0">
              {/* {mask.texture && (
                // center the texture viewer
                <div className="flex justify-center">
                  <TextureViewer
                    name={mask.texture.name}
                    blob={mask.texture.blob ?? ''}
                    selected={false}
                    pixelWidth={mask.texture.pixelWidth}
                    pixelHeight={mask.texture.pixelHeight}
                    isLoaded={true}
                    gpuSize={mask.texture.gpuSize}
                  />
                </div>
              )} */}
              <PropertyEntries renderable={mask} propertyMap={propertyMap} />
            </div>
          </CollapsibleSection>
        </div>
      </div>
      // <div className="flex flex-col">
      //   <div className="items-left flex w-full flex-col justify-between">
      //     <div className="ml-2 text-sm text-white">Class: {mask.class}</div>
      //     <div className="ml-2 text-sm text-white">Type: {mask.type}</div>
      //     <div className="ml-2 text-sm text-white">Label: {mask.label}</div>
      //     <div className="ml-2 text-sm text-white">Width: {formatNumber(mask.width, 3)}</div>
      //     <div className="ml-2 text-sm text-white">Height: {formatNumber(mask.height, 3)}</div>
      //   </div>
      // </div>
    );
  }
  return <></>;
});

{
  /* <PropertyEntry
  className="w-full"
  key={key}
  title={formatCamelCase(key)}
  input={<TextComponent prop={key} entry={{ ...textOptions } as PropertyPanelData['entry']} value={value} />}
  isLast={i === Object.keys(selectedTexture).length - 1}
/>; */
}
