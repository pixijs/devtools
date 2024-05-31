import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

export interface TreeExtension {
  extension: ExtensionMetadata;
  /** to implement */
  onRename: (container: Container, newName: string) => void;
  onDeleted: (container: Container) => void;
  onCreate: (container: Container) => void;
  onSwap: (container: Container, newIndex: number) => void;
  /** to implement */

  getName: (container: Container, data: any) => { name: string; suffix: string };
}
