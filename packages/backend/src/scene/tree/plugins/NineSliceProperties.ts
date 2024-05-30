import { PropertyPlugin } from '@pixi/devtools';
import type { NineSliceSprite } from 'pixi.js';
import { ContainerPropertiesPlugin } from './ContainerProperties';

export const NineSliceSpritePropertiesPlugin: PropertyPlugin = {
  updateProps(nineSlice: NineSliceSprite) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof NineSliceSprite | string;
      const value = nineSlice[prop as keyof NineSliceSprite];

      property.value = value;
    });

    return this.props;
  },
  setValue(nineSlice: NineSliceSprite, prop: string, value: any) {
    (nineSlice as any)[prop] = value;
  },
  containsProperty: ContainerPropertiesPlugin.containsProperty,
  props: [
    { value: null, prop: 'roundPixels', entry: { section: 'Transform', type: 'boolean' } },
    { value: null, prop: 'leftWidth', entry: { section: 'NineSlice Sprite', type: 'number' } },
    { value: null, prop: 'rightWidth', entry: { section: 'NineSlice Sprite', type: 'number' } },
    { value: null, prop: 'topHeight', entry: { section: 'NineSlice Sprite', type: 'number' } },
    {
      value: null,
      prop: 'bottomHeight',
      entry: {
        section: 'NineSlice Sprite',
        type: 'number',
      },
    },
    // {
    //   section: 'NineSlice Sprite',
    //   property: 'textureMatrix',
    //   propertyProps: { label: 'Texture Matrix' },
    //   type: 'matrix',
    // },
    {
      value: null,
      prop: 'originalWidth',
      entry: {
        section: 'NineSlice Sprite',
        type: 'number',
      },
    },
    {
      value: null,
      prop: 'originalHeight',
      entry: {
        section: 'NineSlice Sprite',
        type: 'number',
      },
    },
  ],
};
