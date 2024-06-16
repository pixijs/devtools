---
title: Properties
---

# Properties Extension

The Properties extension enhances the PixiJS Devtools by enabling you to display and edit the properties of any node within the devtools interface. This powerful feature provides flexibility and customization options, allowing you to:

- **Display and Edit Node Properties**: Easily view and modify properties of PixiJS objects directly within the devtools. Changes are reflected in real-time, streamlining the development and debugging process.

- **Add Custom Properties**: Extend the devtools by adding your own custom properties to PixiJS objects. You can define how these properties are displayed and edited, tailoring the interface to meet your specific needs.

```ts
export interface PropertiesExtension {
  /**
   * The metadata for the extension.
   */
  extension: ExtensionMetadata;
  /**
   * Test if the extension can handle the container.
   * @param container The current node.
   */
  testNode(container: Container): boolean;
  /**
   * Test if the extension can handle the property.
   * @param prop The property name.
   */
  testProp(prop: string): boolean;
  /**
   * Set the property for the container.
   * @param container The current node.
   * @param prop The property name.
   * @param value The new value. This value will be an array if
   * the property has multiple inputs. e.g position.
   */
  setProperty(container: Container, prop: string, value: any): void;
  /**
   * Get the properties for the container.
   * @param container The current node.
   */
  getProperties(container: Container): PropertiesEntry[];
}
```

#### Example

```ts
import { Container, Sprite } from 'pixi.js';
import type { ExtensionMetadata } from '@pixi-spine/devtools';

/**
 * Displays the `customProp` property for a Sprite using a text input.
 */
export const properties: PropertiesExtension = {
  extension: {
    type: 'sceneProperties',
    name: 'custom-properties',
  },
  testNode(container: Container) {
    return container instanceof Sprite;
  },
  testProp(prop: string) {
    return prop === 'customProp';
  },
  setProperty(container: Container, prop: string, value: any) {
    if (prop === 'customProp') {
      container.customProp = value;
    }
  },
  getProperties(container: Container) {
    return [
      {
        prop: 'customProp',
        entry: {
          section: 'Custom',
          type: 'text',
          label: 'Custom Property',
        },
      },
    ];
  },
};
```

#### Types of Properties

When using `getProperties`, you can define the type of property you want to display. Below are the different types of properties you can use:

```ts
export type PropertiesEntry = {
  value: any;
  prop: string;
  entry: {
    /**
     * The section to display the property in.
     */
    section: string;
    /**
     * The tooltip to display for the property.
     */
    tooltip?: string;
    /**
     * The label to display for the property.
     */
    label?: string;
    /**
     * The type of input to display for the property.
     */
    type: 'boolean' | 'number' | 'range' | 'select' | 'text' |
          'button' | 'vector2' | 'vectorX' | 'color' | 'multi';
    /**
     * The options for the input.
     */
    options?: any;
  };
};
```

:::tip
To see how to use each type of property, we would recommend looking at how properties are defined for the built-in extensions.

- [Container Properties](https://github.com/pixijs/devtools/blob/main/packages/backend/src/scene/tree/extensions/container/containerPropertyExtension.ts)
:::
