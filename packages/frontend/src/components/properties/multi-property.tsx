import { propertyMap } from './propertyTypes';
import type { PropertyOptions, PropertyPanelData, PropertyTypes } from './propertyTypes';

export interface MultiProps {
  inputs: {
    value: any;
    prop: string;
    entry: {
      label?: string;
      type: PropertyTypes;
      options?: PropertyOptions;
    };
  }[];
}

export const MultiProperty: React.FC<PropertyPanelData> = ({ entry }) => {
  const options = entry.options as MultiProps;

  // for each input, create a component
  const comps = options.inputs.map((input, i) => {
    const PropertyComponent = propertyMap[input.entry.type];
    const onChange = (value: string) => {
      entry.onChange(JSON.stringify([input.prop, JSON.parse(value)]));
    };
    const props = { ...input, entry: { ...input.entry, onChange } } as PropertyPanelData;
    return (
      <div className="flex flex-wrap gap-2 text-xs" key={i}>
        <div className="flex items-center gap-2">
          <div>{input.entry.label}</div>
          <PropertyComponent key={`${input.prop}-${i}`} {...props} />
        </div>
      </div>
    );
  });

  return <div className="flex gap-2">{comps}</div>;
};
