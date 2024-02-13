import { Graphics } from 'pixi.js';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { PropertyPlugin } from './propertyTypes';

export const GraphicsPropsPlugin: PropertyPlugin<Graphics> = {
  ...ContainerPropsPlugin,
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }

    return { value: container[prop as keyof Graphics], prop };
  },
  props: [{ section: 'Transform', property: 'roundPixels', propertyProps: { label: 'Round Pixels' }, type: 'boolean' }],
};
