import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

export interface OverlayExtension {
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
