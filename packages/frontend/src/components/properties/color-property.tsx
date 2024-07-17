import type { ColorProps } from '../ui/color';
import { ColorInput } from '../ui/color';
import type { PropertyPanelData } from './propertyTypes';

export const ColorProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return <ColorInput {...(entry.options as ColorProps)} value={value} onChange={entry.onChange} />;
};
