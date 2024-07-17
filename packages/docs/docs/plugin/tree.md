---
title: Tree
---

# Tree Extension

The Tree extension allows you to filter and display the scene graph in a tree view. This extension is useful for navigating complex scenes and debugging issues related to the structure of your PixiJS application.

```ts
export interface TreeExtension {
  /**
   * The metadata for the extension.
   */
  extension: ExtensionMetadata;
  /**
   * Allows you to update the metadata for a node.
   * Including the name and buttons to be displayed in the tree.
   * @param node The current node.
   * @param metadata The current metadata for the node.
   */
  updateNodeMetadata?(node: Container, metadata: PixiMetadata): PixiMetadata;

  /**
   * Called when a button is pressed on a node.
   * @param container The current node.
   * @param name The name of the button.
   * @param pressed Whether the button is pressed or not. Only used for toggle buttons.
   */
  onButtonPress?: (container: Container, name: string, pressed?: boolean) => void;

  /**
   * Called when a context menu button is selected.
   * @param container The current node.
   * @param contextMenuName The name of the context menu button.
   */
  onContextButtonPress?: (container: Container, contextMenuName: string) => void;
  /**
   * Called when a node is renamed.
   * @param container The current node.
   * @param newName The new name of the node.
   */
  onRename?: (container: Container, newName: string) => void;
  /**
   * Called when a node is deleted.
   * @param container The current node.
   */
  onDeleted?: (container: Container) => void;
  /**
   * Called when a node is swapped.
   * @param container The current node.
   * @param newIndex The new index of the node.
   */
  onSwap?: (container: Container, newIndex: number) => void;
  /**
   * Called when a node is selected.
   * @param container The current node.
   */
  onSelected?: (container: Container) => void;
  /**
   * The buttons to display in the tree panel.
   */
  panelButtons?: ButtonMetadata[];
}
```

#### Example

```ts
import { Container } from 'pixi.js';
import type { ExtensionMetadata } from '@pixi-spine/devtools';

export const tree: TreeExtension = {
  extension: {
    type: 'tree',
    name: 'custom-tree',
  },
  updateNodeMetadata(node: Container, metadata) {
    if (node.name === 'custom') {
      metadata.buttons.push({
        name: 'lock',
        icon: 'lock',
      });
    }
    return metadata;
  },
  onButtonPress(container: Container, buttonName: string, pressed?: boolean) {
    if (buttonName === 'lock') {
      container.locked = pressed;
    }
  },
  onContextButtonPress(container: Container, contextMenuAction: string) {
    if (contextMenuAction === 'delete') {
      container.destroy();
    }
  },
  onRename(container: Container, newName: string) {
    container.name = newName;
  },
  onDeleted(container: Container) {
    container.destroy();
  },
  onSwap(container: Container, newIndex: number) {
    const parent = container.parent;
    if (parent) {
      parent.setChildIndex(container, newIndex);
    }
  },
  onSelected(container: Container) {
    console.log('Selected', container);
  },
  panelButtons: [
    {
      action: 'lock',
      icon: 'lock',
      tooltip: 'Lock Node',
    },
  ],
};
```
