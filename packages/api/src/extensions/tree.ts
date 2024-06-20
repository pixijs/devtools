import type { ExtensionMetadata } from './ext';
import type { Container } from 'pixi.js';

export type PixiNodeType =
  | 'BitmapText'
  | 'HTMLText'
  | 'Text'
  | 'Mesh'
  | 'Graphics'
  | 'Sprite'
  | 'Container'
  | 'AnimatedSprite'
  | 'NineSliceSprite'
  | 'TilingSprite'
  | 'Unknown';

export interface ButtonMetadata {
  name: string;
  icon?: string;
  // tooltip?: string; // TODO: Add tooltip support
  type: 'button' | 'toggle';
  value?: boolean;
}

export type ContextMenuButtonMetadata = Omit<ButtonMetadata, 'type' | 'value'>;

export interface PixiMetadata {
  type: PixiNodeType;
  locked?: boolean;
  suffix?: string;
  buttons?: ButtonMetadata[];
  contextMenu?: ContextMenuButtonMetadata[];
}

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
