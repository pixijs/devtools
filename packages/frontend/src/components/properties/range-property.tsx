import type { SliderProps } from '@radix-ui/react-slider';
import { Slider } from '../ui/slider';
import type { PropertyPanelData } from './propertyTypes';

export const RangeProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Slider
      {...(entry.options as SliderProps)}
      value={[value]}
      onValueChange={(value) => entry.onChange(JSON.stringify(value))}
      className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded outline-none"
    />
  );
};
