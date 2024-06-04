import type { Properties } from '@pixi/devtools';

export const sharedViewProps = [
  {
    prop: 'anchor',
    entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
  },
  { prop: 'roundPixels', entry: { section: 'Transform', type: 'boolean' } },
  {
    prop: 'batched',
    entry: {
      section: 'Rendering',
      options: { label: 'Batched', disabled: true },
      type: 'boolean',
    },
  },
] as Properties[];
