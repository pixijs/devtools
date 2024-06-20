import type { SwitchProps } from '@radix-ui/react-switch';
import { Switch } from '../ui/switch';
import type { PropertyPanelData } from './propertyTypes';

export const BooleanProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Switch
      className="bg-border h-6"
      {...(entry.options as SwitchProps)}
      checked={value}
      onCheckedChange={entry.onChange}
    />
  );
};
