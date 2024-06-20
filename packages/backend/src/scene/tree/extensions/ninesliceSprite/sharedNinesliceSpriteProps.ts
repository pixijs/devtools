import type { Properties } from '@pixi/devtools';

export const sharedNineSliceProps = [
  { prop: 'leftWidth', entry: { section: 'NineSlice Sprite', type: 'number' } },
  { prop: 'rightWidth', entry: { section: 'NineSlice Sprite', type: 'number' } },
  { prop: 'topHeight', entry: { section: 'NineSlice Sprite', type: 'number' } },
  {
    prop: 'bottomHeight',
    entry: {
      section: 'NineSlice Sprite',
      type: 'number',
    },
  },
] as Properties[];
