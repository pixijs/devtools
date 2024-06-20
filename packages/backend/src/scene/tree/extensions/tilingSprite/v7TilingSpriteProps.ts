import type { Properties } from '@pixi/devtools';
import { sharedTilingSpriteProps } from './sharedTilingSpriteProps';

export const v7TilingSpriteProps = [
  ...sharedTilingSpriteProps,
  { value: null, prop: 'uvRespectAnchor', entry: { section: 'Transform', type: 'boolean' } },
] as Properties[];
