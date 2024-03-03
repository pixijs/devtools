import { PropertyPlugin } from '@pixi/devtools';
import type { Mesh } from 'pixi.js';
import { ContainerPropertiesPlugin } from './ContainerProperties';

export const MeshPropertiesPlugin: PropertyPlugin = {
  updateProps(mesh: Mesh) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof Mesh | string;
      const value = mesh[prop as keyof Mesh];

      property.value = value;
    });

    return this.props;
  },
  setValue(mesh: Mesh, prop: string, value: any) {
    (mesh as any)[prop] = value;
  },
  containsProperty: ContainerPropertiesPlugin.containsProperty,
  props: [
    { value: null, prop: 'roundPixels', entry: { section: 'Transform', type: 'boolean' } },
    {
      value: null,
      prop: 'batched',
      entry: {
        section: 'Mesh',
        options: { label: 'Batched', disabled: true },
        type: 'boolean',
      },
    },
  ],
};
