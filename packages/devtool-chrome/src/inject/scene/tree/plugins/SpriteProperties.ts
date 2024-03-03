import { PropertyPlugin } from '@pixi/devtools';
import type { Sprite } from 'pixi.js';

export const SpritePropertiesPlugin: PropertyPlugin = {
  updateProps(sprite: Sprite) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof Sprite | string;
      let value = sprite[prop as keyof Sprite] as any;

      if (value != null && prop === 'anchor') {
        value = [value.x, value.y];
      }

      property.value = value;
    });

    return this.props;
  },
  setValue(sprite: Sprite, prop: string, value: any) {
    prop = prop as keyof Sprite;
    if (prop === 'anchor') {
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
    // { section: 'Appearance', property: 'texture', propertyProps: { label: 'Texture' }, type: 'text' },
  ],
};
