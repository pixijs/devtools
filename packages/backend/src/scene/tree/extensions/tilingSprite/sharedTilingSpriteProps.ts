import type { Properties } from '@pixi/devtools';

export const sharedTilingSpriteProps = [
  {
    prop: 'tilePosition',
    entry: {
      section: 'Tiling Sprite',
      options: { x: { label: 'x' }, y: { label: 'y' } },
      type: 'vector2',
    },
  },
  {
    prop: 'tileScale',
    entry: {
      section: 'Tiling Sprite',
      options: { x: { label: 'x' }, y: { label: 'y' } },
      type: 'vector2',
    },
  },
  { prop: 'tileRotation', entry: { section: 'Tiling Sprite', type: 'number' } },
  { prop: 'clampMargin', entry: { section: 'Tiling Sprite', type: 'number' } },
] as Properties[];
