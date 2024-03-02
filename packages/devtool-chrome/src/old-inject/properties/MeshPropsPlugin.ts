import { Mesh } from 'pixi.js';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { PropertyPlugin } from './propertyTypes';
import { SwitchProps } from '@lib/components/properties/switch/Switch';

export const MeshPropsPlugin: PropertyPlugin<Mesh> = {
  ...ContainerPropsPlugin,
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }
    return { value: container[prop as keyof Mesh], prop };
  },
  props: [
    { section: 'Transform', property: 'roundPixels', propertyProps: { label: 'Round Pixels' }, type: 'boolean' },
    {
      section: 'Mesh',
      property: 'batched',
      propertyProps: { label: 'Batched', disabled: true } as SwitchProps,
      type: 'boolean',
    },
  ],
};
