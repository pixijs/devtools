import { Point, Sprite } from 'pixi.js';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { PropertyPlugin } from './propertyTypes';
import { Vector2Props } from '@lib/components/properties/number/Vector2';

export const SpritePropsPlugin: PropertyPlugin<Sprite> = {
  ...ContainerPropsPlugin,
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }
    if (prop === 'anchor') {
      return { value: [container.anchor.x, container.anchor.y], prop };
    }

    return { value: container[prop as keyof Sprite], prop };
  },
  setPropValue: function (container, prop, value) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }

    if (prop === 'anchor') {
      (container[prop as keyof Sprite] as Point).set(value[0], value[1]);
    } else {
      (container as any)[prop] = value;
    }
  },
  props: [
    {
      section: 'Transform',
      property: 'anchor',
      propertyProps: { label: 'Anchor', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
    { section: 'Transform', property: 'roundPixels', propertyProps: { label: 'Round Pixels' }, type: 'boolean' },
    // { section: 'Appearance', property: 'texture', propertyProps: { label: 'Texture' }, type: 'text' },
  ],
};
