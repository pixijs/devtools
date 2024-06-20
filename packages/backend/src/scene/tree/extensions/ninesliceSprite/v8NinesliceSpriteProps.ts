import type { Properties } from '@pixi/devtools';
import { sharedNineSliceProps } from './sharedNinesliceSpriteProps';

export const v8NinesSliceProps = [
  ...sharedNineSliceProps,
  {
    prop: 'originalWidth',
    entry: {
      section: 'NineSlice Sprite',
      type: 'number',
    },
  },
  {
    prop: 'originalHeight',
    entry: {
      section: 'NineSlice Sprite',
      type: 'number',
    },
  },
] as Properties[];
