import type { ExtensionMetadata } from './ext';
import type { Container } from 'pixi.js';

type PropertyPanelData = {
  value: any;
  prop: string;
  entry: {
    section: string;
    label?: string;
    type: 'boolean' | 'number' | 'range' | 'select' | 'text' | 'button' | 'vector2' | 'vectorX' | 'color';
    options?: any;
    onChange: (value: string | number | boolean) => void;
  };
};

type NoOnChange = Omit<PropertyPanelData['entry'], 'onChange'>;
type Props = Omit<PropertyPanelData, 'entry'> & { entry: NoOnChange };

export type PropertiesEntry = Props & { allowUndefined?: boolean; allowCopy?: boolean };
export type Properties = Omit<Props, 'value'> & { allowUndefined?: boolean; allowCopy?: boolean };

export interface PropertiesExtension {
  extension: ExtensionMetadata;

  properties: () => Properties[];
  testNode(container: Container): boolean;
  testProp(prop: string): boolean;

  setProperty(container: Container, prop: string, value: any): void;
  getProperties(container: Container): PropertiesEntry[];
  copyProperty(container: Container, prop: string): void;
}
