import type { PropertiesEntry, PropertiesExtension } from '@pixi/devtools';
import type { AnimatedSprite } from 'pixi.js';
import { sharedViewProps } from './viewProps';
import { arrayToPoint, pointToArray } from '../utils/convertProp';

export const viewPropertyExtension: PropertiesExtension = {
  extension: {
    type: 'sceneProperties',
    name: 'default-view-properties',
    priority: 0,
  },
  properties() {
    return sharedViewProps;
  },
  testNode() {
    // any node could have these properties, so might as well always check
    return true;
  },
  testProp(prop: string) {
    // test if the property is in the list
    return this.properties().some((p) => prop.startsWith(p.prop));
  },
  getProperties(container: AnimatedSprite) {
    // get the properties from the container
    const activeProps = this.properties().reduce((result, property) => {
      const prop = property.prop;
      let value = container[prop as keyof AnimatedSprite];

      if (value != null && prop === 'anchor') {
        value = pointToArray(value);
      }

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
  setProperty(container: AnimatedSprite, prop, value) {
    if (prop === 'anchor') {
      arrayToPoint(container, prop, value);
    } else {
      (container as any)[prop] = value;
    }
  },
  copyProperty() {
    // copy the property from the container
    console.error('Not implemented');
  },
};
