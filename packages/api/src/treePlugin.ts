import { Container } from 'pixi.js';

export interface TreePlugin {
  /** to implement */
  onRename: (container: Container, newName: string) => void;
  onDeleted: (container: Container) => void;
  onCreate: (container: Container) => void;
  onSwap: (container: Container, newIndex: number) => void;
  /** to implement */

  getName: (container: Container, data: any) => { name: string; suffix: string };
}
