import type { Vector2Props, VectorXProps } from '../ui/vector2';
import { Vector2, VectorX } from '../ui/vector2';
import type { PropertyPanelData } from './propertyTypes';

export const Vector2Property: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return <Vector2 {...(entry.options as Vector2Props)} onChange={entry.onChange} value={value} />;
};

export const VectorXProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return <VectorX {...(entry.options as VectorXProps)} onChange={entry.onChange} value={value} />;
};
