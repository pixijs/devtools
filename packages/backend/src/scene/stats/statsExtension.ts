import type { DevtoolState } from '@devtool/frontend/types';
import type { StatsExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';
import { getPixiType } from '../../utils/getPixiType';

export const totalStatsExtension: StatsExtension = {
  extension: {
    type: 'stats',
    name: 'default-stats-total',
  },

  track: (_container: Container, state: NonNullable<DevtoolState['stats']>) => {
    state.total = (state.total || 0) + 1;
  },

  getKeys: () => {
    return ['total'];
  },
};

const typeMap = {
  Container: 'container',
  Sprite: 'sprite',
  Graphics: 'graphics',
  Mesh: 'mesh',
  Text: 'text',
  BitmapText: 'bitmapText',
  HTMLText: 'htmlText',
  AnimatedSprite: 'animatedSprite',
  NineSliceSprite: 'nineSliceSprite',
  TilingSprite: 'tilingSprite',
};

export const pixiStatsExtension = {
  extension: {
    type: 'stats',
    name: 'default-stats-pixi',
  },
  track(container: Container, state: NonNullable<DevtoolState['stats']>) {
    const type = getPixiType(container) as keyof typeof typeMap;
    const mappedType = typeMap[type];

    if (mappedType) {
      state[mappedType] = (state[mappedType] || 0) + 1;
    }
  },
  getKeys: () => {
    return Object.values(typeMap);
  },
} satisfies StatsExtension;
