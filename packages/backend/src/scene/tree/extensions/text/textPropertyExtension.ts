import type { PropertiesEntry } from '@pixi/devtools';
import type { Text } from 'pixi.js';
import { PixiDevtools } from '../../../../pixi';
import { isText } from '../../../../utils/getPixiType';
import type { DefaultPropertyExtension } from '../container/containerPropertyExtension';
import { textProps } from './textProps';

export const textPropertyExtension: DefaultPropertyExtension = {
  extension: {
    type: 'sceneProperties',
    name: 'default-text-properties',
    priority: 0,
  },
  properties() {
    return textProps;
  },
  testNode(container: Text) {
    return isText(container, PixiDevtools.pixi);
  },
  testProp(prop: string) {
    // test if the property is in the list
    return this.properties().some((p) => prop.startsWith(p.prop));
  },
  getProperties(container: Text) {
    // get the properties from the container
    const activeProps = this.properties().reduce((result, property) => {
      const prop = property.prop;
      const value = container[prop as keyof Text];

      if (value == null && property.allowUndefined !== true) {
        return result;
      }

      result.push({
        ...property,
        value,
      });

      return result;
    }, [] as PropertiesEntry[]);

    return activeProps;
  },
  setProperty(container: Text, prop, value) {
    (container as any)[prop] = value;
  },
};
