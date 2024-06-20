import type { ButtonProps } from '../ui/button';
import { Button } from '../ui/button';
import type { PropertyPanelData } from './propertyTypes';

export type ButtonFnProps = { label: string } & ButtonProps;
export const ButtonProperty: React.FC<PropertyPanelData> = ({ entry }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded outline-none"
      onClick={() => entry.onChange(true)}
      {...(entry.options as ButtonFnProps)}
    >
      {(entry.options as ButtonFnProps)?.label ?? entry.label ?? 'Click'}
    </Button>
  );
};
