import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

export type MultiProps = {
  inputs: Omit<PropertyPanelData['entry'], 'section' | 'tooltip'>[];
};

type PropertyPanelData = {
  value: any;
  prop: string;
  entry: {
    section: string;
    tooltip?: string;
    label?: string;
    type: 'boolean' | 'number' | 'range' | 'select' | 'text' | 'button' | 'vector2' | 'vectorX' | 'color' | 'multi';
    options?: any;
  };
};

export type PropertiesEntry = PropertyPanelData & { allowUndefined?: boolean; allowCopy?: boolean };
export type Properties = Omit<PropertyPanelData, 'value'> & { allowUndefined?: boolean; allowCopy?: boolean };

export interface PropertiesExtension {
  extension: ExtensionMetadata;

  properties: () => Properties[];
  testNode(container: Container): boolean;
  testProp(prop: string): boolean;

  setProperty(container: Container, prop: string, value: any): void;
  getProperties(container: Container): PropertiesEntry[];
  copyProperty(container: Container, prop: string): void;
}
