import { Text } from 'pixi.js';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { PropertyPlugin } from './propertyTypes';

export const TextPropsPlugin: PropertyPlugin<Text> = {
  ...ContainerPropsPlugin,
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }

    return { value: container[prop as keyof Text], prop };
  },
  props: [
    { section: 'Transform', property: 'roundPixels', propertyProps: { label: 'Round Pixels' }, type: 'boolean' },
    { section: 'Text', property: 'text', propertyProps: { label: 'Text' }, type: 'text' },
    // { section: 'Text', property: 'style', propertyProps: { label: 'Style' }, type: 'text' },
    { section: 'Text', property: 'resolution', propertyProps: { label: 'Resolution' }, type: 'number' },
  ],
};
