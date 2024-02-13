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

    return { value: container[prop as keyof TilingSprite], prop };
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
  ],
};
