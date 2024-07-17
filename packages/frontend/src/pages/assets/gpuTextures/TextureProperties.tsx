import { PropertyEntry } from '../../../components/properties/propertyEntry';
import { useDevtoolStore } from '../../../App';
import type { PropertyPanelData } from '../../../components/properties/propertyTypes';
import { propertyMap } from '../../../components/properties/propertyTypes';
import { formatCamelCase } from '../../../lib/utils';

interface PanelProps {
  children: React.ReactNode;
}
const Panel: React.FC<PanelProps> = ({ children }) => {
  return (
    <>
      <div className="relative left-0 top-0 w-full overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="border-border flex h-8 max-h-8 items-center border-b"></div>
          <div className="flex-1 overflow-auto p-2">
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export const TextureProperties = () => {
  const selectedTexture = useDevtoolStore.use.selectedTexture();

  if (!selectedTexture) {
    return (
      <Panel>
        <p className="text-center">Select a texture to view its properties</p>
      </Panel>
    );
  }
  const TextComponent = propertyMap.text;
  const textOptions = { options: { disabled: true } };
  const name = selectedTexture.name === '' ? 'Unnamed' : selectedTexture.name.split('/').pop();

  return (
    <Panel>
      <div className="flex h-full w-full flex-col items-center justify-center p-1">
        <div className="flex h-64 w-64 items-center justify-center overflow-hidden">
          <img src={selectedTexture.blob!} alt="content" className="max-h-full max-w-full" />
        </div>
        {Object.keys(selectedTexture).map((key, i) => {
          if (key === 'isLoaded' || key === 'blob') {
            return null;
          }
          let value = selectedTexture[key as keyof typeof selectedTexture];

          if (key === 'name') {
            value = name || 'Unnamed';
          } else if (key === 'gpuSize') {
            value = ((value as number) / (1024 * 1024)).toFixed(3) + ' MB';
          }
          return (
            <PropertyEntry
              className="w-full"
              key={key}
              title={formatCamelCase(key)}
              input={
                <TextComponent prop={key} entry={{ ...textOptions } as PropertyPanelData['entry']} value={value} />
              }
              isLast={i === Object.keys(selectedTexture).length - 1}
            />
          );
        })}
      </div>
    </Panel>
  );
};
