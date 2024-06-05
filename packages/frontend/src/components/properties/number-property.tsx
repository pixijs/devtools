import type { InputProps } from '../ui/input';
import { Input } from '../ui/input';
import type { PropertyPanelData } from './propertyTypes';

export const NumberProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Input
      {...(entry.options as InputProps)}
      type="number"
      value={value}
      onChange={(e) => entry.onChange(Number(e.target.value))}
      className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded text-xs outline-none"
    />
  );
};
