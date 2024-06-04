import type { Properties } from '@pixi/devtools';
import { sharedContainerProps } from './sharedContainerProps';

export const v7ContainerProps = [
  ...sharedContainerProps,
  { prop: 'name', entry: { section: 'Info', type: 'text' } },
  {
    prop: 'blendMode',
    entry: {
      section: 'Appearance',
      options: {
        options: [
          'inherit',
          'normal',
          'add',
          'multiply',
          'screen',
          'overlay',
          'darken',
          'lighten',
          'color-dodge',
          'color-burn',
          'hard-light',
          'soft-light',
          'difference',
          'exclusion',
          'hue',
          'saturation',
          'color',
          'luminosity',
          'none',
        ],
      },
      type: 'select',
    },
  },
] as Properties[];
