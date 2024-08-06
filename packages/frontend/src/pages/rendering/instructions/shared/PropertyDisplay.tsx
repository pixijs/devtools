import type React from 'react';
import { PropertyEntry } from '../../../../components/properties/propertyEntry';

interface PropertyEntriesProps {
  renderable: Record<string, any>;
  propertyMap: {
    vector2: React.ComponentType<any>;
    vectorX: React.ComponentType<any>;
    text: React.ComponentType<any>;
  };
  ignore?: string[];
}

export const PropertyEntries: React.FC<PropertyEntriesProps> = ({ renderable, propertyMap, ignore }) => {
  const formatCamelCase = (str: string) => {
    // Assuming formatCamelCase is defined elsewhere
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  const comps = Object.entries(renderable).map(([key, value]) => {
    const val = value;
    const formattedKey = formatCamelCase(key);
    if (key === 'texture' || value === null || (ignore && ignore.includes(key))) {
      return null;
    }

    if (value instanceof Object && 'x' in value && 'y' in value && !('width' in value)) {
      const Vector2 = propertyMap.vector2;

      const props = {
        value: [value.x, value.y],
        prop: key,
        entry: {
          options: { x: { label: 'x', disabled: true }, y: { label: 'y', disabled: true } },
          onChange: () => {},
        },
      };

      return <PropertyEntry key={`${key}-entry`} title={formattedKey} input={<Vector2 {...props} />} isLast={true} />;
    } else if (value instanceof Object && 'x' in value && 'y' in value && 'width' in value) {
      const VectorX = propertyMap.vectorX;

      const props = {
        value: [value.x, value.y, value.width, value.height],
        prop: key,
        entry: {
          options: {
            inputs: [
              { label: 'x', disabled: true },
              { label: 'y', disabled: true },
              { label: 'width', disabled: true },
              { label: 'height', disabled: true },
            ],
          },
          onChange: () => {},
        },
      };

      return <PropertyEntry key={`${key}-entry`} title={formattedKey} input={<VectorX {...props} />} isLast={true} />;
    }

    const TextComp = propertyMap.text;
    const props = {
      value: val,
      prop: key,
      entry: {
        options: { disabled: true },
        onChange: () => {},
      },
    };
    return <PropertyEntry key={`${key}-entry`} title={formattedKey} input={<TextComp {...props} />} isLast={true} />;
  });

  return <>{comps}</>;
};
