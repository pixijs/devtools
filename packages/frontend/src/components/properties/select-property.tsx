import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { PropertyPanelData, SelectionProps } from './propertyTypes';

export const SelectProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Select value={value} onValueChange={(value) => entry.onChange(JSON.stringify(value))}>
      <SelectTrigger className="border-border hover:border-primary focus:border-primary h-7 w-full text-sm outline-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(entry.options as SelectionProps).options.map((option: string) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
