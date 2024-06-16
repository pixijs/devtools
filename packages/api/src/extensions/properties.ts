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
  /**
   * Test if the plugin can handle the container.
   * @param container The current node.
   */
  testNode(container: Container): boolean;
  /**
   * Test if the plugin can handle the property.
   * @param prop The property name.
   */
  testProp(prop: string): boolean;
  /**
   * Set the property for the container.
   * @param container The current node.
   * @param prop The property name.
   * @param value The new value. This value will be an array if the property has multiple inputs. e.g position.
   */
  setProperty(container: Container, prop: string, value: any): void;
  /**
   * Get the properties for the container.
   * @param container The current node.
   */
  getProperties(container: Container): PropertiesEntry[];
}
