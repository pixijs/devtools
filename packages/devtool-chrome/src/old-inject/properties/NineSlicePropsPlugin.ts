import { NineSliceSprite } from 'pixi.js';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { PropertyPlugin } from './propertyTypes';

export const NineSliceSpritePropsPlugin: PropertyPlugin<NineSliceSprite> = {
  ...ContainerPropsPlugin,
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }

    return { value: container[prop as keyof NineSliceSprite], prop };
  },
  props: [
    { section: 'Transform', property: 'roundPixels', propertyProps: { label: 'Round Pixels' }, type: 'boolean' },
    { section: 'NineSlice Sprite', property: 'leftWidth', propertyProps: { label: 'Left Width' }, type: 'number' },
    { section: 'NineSlice Sprite', property: 'rightWidth', propertyProps: { label: 'Right Width' }, type: 'number' },
    { section: 'NineSlice Sprite', property: 'topHeight', propertyProps: { label: 'Top Height' }, type: 'number' },
    {
      section: 'NineSlice Sprite',
      property: 'bottomHeight',
      propertyProps: { label: 'Bottom Height' },
      type: 'number',
    },
    // {
    //   section: 'NineSlice Sprite',
    //   property: 'textureMatrix',
    //   propertyProps: { label: 'Texture Matrix' },
    //   type: 'matrix',
    // },
    {
      section: 'NineSlice Sprite',
      property: 'originalWidth',
      propertyProps: { label: 'Original Width' },
      type: 'number',
    },
    {
      section: 'NineSlice Sprite',
      property: 'originalHeight',
      propertyProps: { label: 'Original Height' },
      type: 'number',
    },
  ],
};
