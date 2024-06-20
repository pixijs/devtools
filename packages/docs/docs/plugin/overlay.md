---
title: Overlay
---
# Overlay Extension

The overlay extension allows you to highlight the bounds of a PixiJS object in the scene. This is useful for debugging layout and alignment issues.
You can customise the style of the overlay for selected and hovered nodes, as well as define the bounds of the node.

Since you can change the styling and bounds per node, you can use this extension to create custom overlays for different types of objects.

```ts
export interface OverlayExtension {
  /**
   * The metadata for the extension.
   */
  extension: ExtensionMetadata;
  /**
   * Get the css style for the selected highlight overlay.
   * @param node The selected node.
   */
  getSelectedStyle?(node: Container | null): Partial<CSSStyleDeclaration>;
  /**
   * Get the css style for the hover highlight overlay.
   * @param node The hovered node.
   */
  getHoverStyle?(node: Container | null): Partial<CSSStyleDeclaration>;
  /**
   * Get the global position of the node.
   * @param node The currently selected node to get the global position of.
   */
  getGlobalBounds?(node: Container): { x: number; y: number; width: number; height: number };
}
```

#### Example

```ts
import { Container, Sprite, Text, Rectangle } from 'pixi.js';
import type { ExtensionMetadata } from '@pixi-spine/devtools';

export const overlay: OverlayExtension = {
  extension: {
    type: 'overlay',
    name: 'custom-overlay',
  },
  getSelectedStyle(node: Container | null) {
    const options = {} as Partial<CSSStyleDeclaration>;

    if (node instanceof Sprite) {
      return {
        border: '2px solid #ff0000',
      };
    } else if (node instanceof Container) {
      return {
        border: '1px solid #00ff00',
      };
    }

    return {
      border: '2px solid #ff0000',
    };
  },
  getHoverStyle(node: Container | null) {
    return {
      border: '2px solid #00ff00',
    };
  },
  getGlobalBounds(node: Container) {
    if (node instanceof Text) {
      // Custom bounds for text objects
      const bounds = node.getBounds();
      return new Rectangle(bounds.x, bounds.y, bounds.width + 10, bounds.height + 10);
    }
    // Default bounds
    return node.getBounds();
  },
};
```
