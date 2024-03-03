import { PropertyPlugin } from '@pixi/devtools';
import type { Text } from 'pixi.js';

export const TextPropertiesPlugin: PropertyPlugin = {
  updateProps(text: Text) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof Text | string;
      let value = text[prop as keyof Text] as any;

      if (value != null && prop === 'anchor') {
        value = [value.x, value.y];
      }

      property.value = value;
    });

    return this.props;
  },
  setValue(text: Text, prop: string, value: any) {
    prop = prop as keyof Text;

    if (prop === 'anchor') {
      text[prop].set(value[0], value[1]);
    } else {
      (text as any)[prop] = value;
    }
  },
  props: [
    {
      value: null,
      prop: 'anchor',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    { value: null, prop: 'roundPixels', entry: { section: 'Transform', type: 'boolean' } },
    { value: null, prop: 'text', entry: { section: 'Text', type: 'text' } },
    // { section: 'Text', property: 'style', propertyProps: { label: 'Style' }, type: 'text' },
    { value: null, prop: 'resolution', entry: { section: 'Text', type: 'number' } },
  ],
};
