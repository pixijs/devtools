import { CollapsibleSection } from '../../../../components/collapsible/collapsible-section';
import { propertyMap } from '../../../../components/properties/propertyTypes';
import { memo } from 'react';
import { PropertyEntries } from './PropertyDisplay';
import { Texture } from './Texture';
import { cn } from '../../../../lib/utils';

interface InstructionSectionProps {
  drawTextures: string[];
  type: string;
  action: string;
  children?: React.ReactNode;
}
export const InstructionSection: React.FC<InstructionSectionProps> = memo(
  ({ drawTextures, type, action, children }) => {
    return (
      <CollapsibleSection key={'instruction'} title={'Instruction'} className="border-x">
        <div className="flex flex-col px-2 py-1 [&>*:first-child]:pt-0">
          <PropertyEntries renderable={{ type, action }} propertyMap={propertyMap} />
          {children}
          {drawTextures.length > 0 && (
            <div className={cn('flex h-full items-center pt-1', '')}>
              <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs">Draw Call Textures</div>
              <div className="ml-2 flex flex-row flex-wrap gap-2 py-1">
                {drawTextures.map((texture, i) => (
                  <Texture key={i + 'bt'} texture={texture} size={52} border={'border-border'} />
                ))}
              </div>
            </div>
            // <>
            //   <div className="break-keep py-2 text-xs text-white">Draw Call Textures</div>
            //   <div className="ml-2 flex flex-row flex-wrap justify-center gap-2 py-1">
            //     {drawTextures.map((texture, i) => (
            //       <Texture key={i + 'bt'} texture={texture} size={64} border={'border-border'} />
            //     ))}
            //   </div>
            // </>
          )}
        </div>
      </CollapsibleSection>
    );
  },
);
