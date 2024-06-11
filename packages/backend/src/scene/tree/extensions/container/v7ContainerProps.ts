import type { Properties } from '@pixi/devtools';
import { sharedContainerProps } from './sharedContainerProps';

export const v7BlendModeMap = {
  normal: 0,
  add: 1,
  multiply: 2,
  screen: 3,
  overlay: 4,
  darken: 5,
  lighten: 6,
  colorDodge: 7,
  colorBurn: 8,
  hardLight: 9,
  softLight: 10,
  difference: 11,
  exclusion: 12,
  hue: 13,
  saturation: 14,
  color: 15,
  luminosity: 16,
  none: 20,
};

export const v7ContainerProps = [
  ...sharedContainerProps,
  { prop: 'name', entry: { section: 'Info', type: 'text' } },
  {
    prop: 'blendMode',
    entry: {
      section: 'Appearance',
      options: {
        options: [
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
