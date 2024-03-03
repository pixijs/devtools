import { PropertyPlugin } from '@pixi/devtools';
import type { Graphics } from 'pixi.js';
import { ContainerPropertiesPlugin } from './ContainerProperties';

export const GraphicsPropertiesPlugin: PropertyPlugin = {
  updateProps(graphic: Graphics) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof Graphics | string;
      const value = graphic[prop as keyof Graphics];

      property.value = value;
    });

    return this.props;
  },
  containsProperty: ContainerPropertiesPlugin.containsProperty,
  setValue(graphic: Graphics, prop: string, value: any) {
    (graphic as any)[prop] = value;
  },
  props: [{ value: null, prop: 'roundPixels', entry: { section: 'Transform', type: 'boolean' } }],
};
