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

export interface PixiMetadata {
  type: PixiNodeType;
  locked?: boolean;
  suffix?: string;
  buttons?: string[];
  contextMenu?: string[];
}

export interface TreeExtension {
  extension: ExtensionMetadata;
  updateNodeMetadata?(node: Container, metadata: PixiMetadata): PixiMetadata;

  onButtonPress?: (container: Container, buttonAction: string, pressed?: boolean) => void;
  onContextMenu?: (container: Container, contextMenuAction: string) => void;

  onRename?: (container: Container, newName: string) => void;
  onDeleted?: (container: Container) => void;
  onSwap?: (container: Container, newIndex: number) => void;
  onSelected?: (container: Container) => void;

  panelButtons?: string[];
}
