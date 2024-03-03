import { PropertyPlugin } from '@pixi/devtools';
import type { TilingSprite } from 'pixi.js';

export const TilingSpritePropertiesPlugin: PropertyPlugin = {
  updateProps(sprite: TilingSprite) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof TilingSprite | string;
      let value = sprite[prop as keyof TilingSprite] as any;

      if (value != null && (prop === 'anchor' || prop === 'tilePosition' || prop === 'tileScale')) {
        value = [value.x, value.y];
      }

      property.value = value;
    });

    return this.props;
  },
  setValue(sprite: TilingSprite, prop: string, value: any) {
    prop = prop as keyof TilingSprite;
    if (prop === 'anchor' || prop === 'tilePosition' || prop === 'tileScale') {
      sprite[prop].set(value[0], value[1]);
    } else {
      (sprite as any)[prop] = value;
    }
  },
  props: [
    {
      value: null,
      prop: 'anchor',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    { value: null, prop: 'roundPixels', entry: { section: 'Transform', type: 'boolean' } },
    {
      value: null,
      prop: 'tilePosition',
      entry: {
        section: 'Tiling Sprite',
        options: { x: { label: 'x' }, y: { label: 'y' } },
        type: 'vector2',
      },
    },
    {
      value: null,
      prop: 'tileScale',
      entry: {
        section: 'Tiling Sprite',
        options: { x: { label: 'x' }, y: { label: 'y' } },
        type: 'vector2',
      },
    },
    { value: null, prop: 'tileRotation', entry: { section: 'Tiling Sprite', type: 'number' } },
    { value: null, prop: 'clampMargin', entry: { section: 'Tiling Sprite', type: 'number' } },
  ],
};
