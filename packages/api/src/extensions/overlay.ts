import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

type RGB = `rgb(${string})`;
type RGBA = `rgba(${string})`;
type HEX = `#${string}`;
type HSL = `hsl(${string})`;
type HSLA = `hsla(${string})`;

type Color = RGB | RGBA | HEX | HSL | HSLA;

export interface OverlayExtension {
  extension: ExtensionMetadata;
  selectedColor?: Color;
  hoverColor?: Color;
  getGlobalPosition?(node: Container): {
    transform: { a: number; b: number; c: number; d: number; tx: number; ty: number };
    bounds: { x: number; y: number; width: number; height: number };
  };
}
