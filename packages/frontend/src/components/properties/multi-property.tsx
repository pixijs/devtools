import { useEffect, useState } from 'react';
import type { PropertyOptions, PropertyPanelData, PropertyTypes } from './propertyTypes';
import { propertyMap } from './propertyTypes';

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
  const initializeValues = () => options.inputs.map((input) => input.value);
  const [currentValues, setCurrentValues] = useState(initializeValues);
  const inputsDependency =
    options.inputs.length + options.inputs.map((input) => `${input.prop}${input.value}`).join(',');

  useEffect(() => {
    setCurrentValues(initializeValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputsDependency]);

  const comps = options.inputs.map((input, i) => {
    const PropertyComponent = propertyMap[input.entry.type];
    const onChange = (value: string) => {
      setCurrentValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[i] = JSON.parse(value);
        entry.onChange(JSON.stringify([input.prop, newValues]));
        return newValues;
      });
    };
    const props = { ...input, entry: { ...input.entry, onChange }, value: currentValues[i] } as PropertyPanelData;
    return (
      <div className="flex flex-wrap gap-2 text-xs" key={input.prop + i}>
        <div className="flex items-center gap-2">
          <div>{input.entry.label}</div>
          <PropertyComponent key={`${input.prop}-${i}`} {...props} />
        </div>
      </div>
    );
  });

  return <div className="flex gap-2">{comps}</div>;
};
