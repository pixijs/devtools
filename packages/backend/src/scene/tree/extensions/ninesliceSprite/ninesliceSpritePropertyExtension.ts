import type { PropertiesExtension } from '@pixi/devtools';
import type { AnimatedSprite } from 'pixi.js';
import { PixiDevtools } from '../../../../pixi';
import { isNineSliceSprite } from '../../../../utils/getPixiType';
import { getProps } from '../utils/getProps';
import { v7NineSliceProps } from './v7NinesliceSpriteProps';
import { v8NinesSliceProps } from './v8NinesliceSpriteProps';

export const nineSlicePropertyExtension: PropertiesExtension = {
  extension: {
    type: 'sceneProperties',
    name: 'default-nineslice-properties',
    priority: 0,
  },
  properties() {
    return getProps(v7NineSliceProps, v8NinesSliceProps);
  },
  testNode(container: AnimatedSprite) {
    return isNineSliceSprite(container, PixiDevtools.pixi);
  },
  testProp(prop: string) {
    // test if the property is in the list
    return this.properties().some((p) => prop.startsWith(p.prop));
  },
  getProperties(container: AnimatedSprite) {
    // get the properties from the container
    const activeProps = this.properties().reduce((result, property) => {
      const prop = property.prop;
      const value = container[prop as keyof AnimatedSprite];

      if (value == null && property.allowUndefined !== true) {
        return result;
      }

      result.push({
        ...property,
        value,
      });

      return result;
    }, [] as any[]);

    return activeProps;
  },
  setProperty(container: AnimatedSprite, prop, value) {
    (container as any)[prop] = value;
  },
  copyProperty() {
    // copy the property from the container
    console.error('Not implemented');
  },
};
