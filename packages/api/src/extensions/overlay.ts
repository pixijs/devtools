import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

export interface OverlayExtension {
  extension: ExtensionMetadata;
  getSelectedStyle?(node: Container | null): Partial<CSSStyleDeclaration>;
  getHoverStyle?(node: Container | null): Partial<CSSStyleDeclaration>;
  getGlobalPosition?(node: Container): {
    bounds: { x: number; y: number; width: number; height: number };
  };
}
