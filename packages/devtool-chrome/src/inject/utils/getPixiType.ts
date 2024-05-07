import { Container } from 'pixi.js';
import { PixiDevtools } from '../pixi';
import { PixiNodeType } from '@devtool/frontend/types';

export function getPixiType(container: Container): PixiNodeType {
  const pixi = PixiDevtools.pixi;

  if (!pixi) return 'Unknown';

  if (pixi.BitmapText && container instanceof pixi.BitmapText) {
    return 'BitmapText';
  } else if (pixi.HTMLText && container instanceof pixi.HTMLText) {
    return 'HTMLText';
  } else if (pixi.Text && container instanceof pixi.Text) {
    return 'Text';
  } else if (pixi.Mesh && container instanceof pixi.Mesh) {
    return 'Mesh';
  } else if (pixi.Graphics && container instanceof pixi.Graphics) {
    return 'Graphics';
  } else if (pixi.AnimatedSprite && container instanceof pixi.AnimatedSprite) {
    return 'AnimatedSprite';
  } else if (
    // in v7 NineSliceSprite does not exist
    (pixi.NineSliceSprite && container instanceof pixi.NineSliceSprite) ||
    (pixi.NineSlicePlane && container instanceof pixi.NineSlicePlane)
  ) {
    return 'NineSliceSprite';
  } else if (pixi.TilingSprite && container instanceof pixi.TilingSprite) {
    return 'TilingSprite';
  } else if (pixi.Sprite && container instanceof pixi.Sprite) {
    return 'Sprite';
  } else if (pixi.Container && container instanceof pixi.Container) {
    return 'Container';
  }

  return 'Unknown';
}
