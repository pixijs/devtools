import { TilingSprite } from 'pixi.js';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { PropertyPlugin } from './propertyTypes';
import { Vector2Props } from '@lib/components/properties/number/Vector2';

export const TilingSpritePropsPlugin: PropertyPlugin<TilingSprite> = {
  ...ContainerPropsPlugin,
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }

    if (prop === 'tilePosition') {
      return { value: [container.tilePosition.x, container.tilePosition.y], prop };
    } else if (prop === 'tileScale') {
      return { value: [container.tileScale.x, container.tileScale.y], prop };
    }

    return { value: container[prop as keyof TilingSprite], prop };
  },
  setPropValue: function (container, prop, value) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }

    if (prop === 'tilePosition' || prop === 'tileScale') {
      container.tilePosition.set(value[0], value[1]);
    } else {
      (container as any)[prop] = value;
    }
  },
  props: [
    { section: 'Transform', property: 'roundPixels', propertyProps: { label: 'Round Pixels' }, type: 'boolean' },
    {
      section: 'Tiling Sprite',
      property: 'tilePosition',
      propertyProps: { label: 'Tile Position', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
    {
      section: 'Tiling Sprite',
      property: 'tileScale',
      propertyProps: { label: 'Tile Scale', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
    { section: 'Tiling Sprite', property: 'tileRotation', propertyProps: { label: 'Tile Rotation' }, type: 'number' },
    { section: 'Tiling Sprite', property: 'clampMargin', propertyProps: { label: 'Clamp Margin' }, type: 'number' },
  ],
};
