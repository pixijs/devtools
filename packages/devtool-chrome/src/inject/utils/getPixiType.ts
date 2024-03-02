import { Container } from 'pixi.js';
import { PixiDevtools } from '../pixi';

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
export function getPixiType(container: Container): PixiNodeType {
  const pixi = PixiDevtools.pixi;

  if (!pixi) return 'Unknown';

  if (container instanceof pixi.BitmapText) {
    return 'BitmapText';
  } else if (container instanceof pixi.HTMLText) {
    return 'HTMLText';
  } else if (container instanceof pixi.Text) {
    return 'Text';
  } else if (container instanceof pixi.Mesh) {
    return 'Mesh';
  } else if (container instanceof pixi.Graphics) {
    return 'Graphics';
  } else if (container instanceof pixi.AnimatedSprite) {
    return 'AnimatedSprite';
  } else if (
    // in v7 NineSliceSprite does not exist
    (pixi.NineSliceSprite && container instanceof pixi.NineSliceSprite) ||
    container instanceof pixi.NineSlicePlane
  ) {
    return 'NineSliceSprite';
  } else if (container instanceof pixi.TilingSprite) {
    return 'TilingSprite';
  } else if (container instanceof pixi.Sprite) {
    return 'Sprite';
  } else if (container instanceof pixi.Container) {
    return 'Container';
  }

  return 'Unknown';
}
