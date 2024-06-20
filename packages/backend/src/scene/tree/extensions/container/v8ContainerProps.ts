import type { Properties } from '@pixi/devtools';
import { sharedContainerProps } from './sharedContainerProps';

export const v8ContainerProps = [
  ...sharedContainerProps,
  { prop: 'label', entry: { section: 'Info', type: 'text' } },
  {
    prop: 'blendMode',
    entry: {
      section: 'Appearance',
      tooltip: `To use certain modes, enable them as follows:\n{{import 'pixi.js/advanced-blend-modes';}}`,
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
          'erase',
          'subtract',
          'linear-burn',
          'linear-dodge',
          'linear-light',
          'pin-light',
          'divide',
          'vivid-light',
          'hard-mix',
          'negation',
        ],
      },
      type: 'select',
    },
  },
  {
    prop: 'boundsArea',
    entry: {
      section: 'Rendering',
      options: {
        inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
      },
      type: 'vectorX',
    },
  },
  { prop: 'isRenderGroup', entry: { section: 'Rendering', type: 'boolean' } },

  { prop: 'cullable', entry: { section: 'Culling', type: 'boolean' } },
  {
    prop: 'cullArea',
    entry: {
      section: 'Culling',
      options: {
        inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
      },
      type: 'vectorX',
    },
  },
  { prop: 'cullableChildren', entry: { section: 'Culling', type: 'boolean' } },
] as Properties[];
