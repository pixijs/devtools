import type { PropertiesEntry } from '@pixi/devtools';
import type { Container } from 'pixi.js';
import { PixiDevtools } from '../../../../pixi';
import { isTilingSprite } from '../../../../utils/getPixiType';
import type { DefaultPropertyExtension } from '../container/containerPropertyExtension';
import { arrayToPoint, pointToArray } from '../utils/convertProp';
import { getProps } from '../utils/getProps';
import { v7TilingSpriteProps } from './v7TilingSpriteProps';
import { v8TilingSpriteProps } from './v8TilingSpriteProps';

const propertyValueExtractors = {
  tilePosition: pointToArray,
  tileScale: pointToArray,
} as const;

type PropertyValueExtractors = keyof typeof propertyValueExtractors;

const propertyValueSetters: Record<PropertyValueExtractors, any> = {
  tilePosition: arrayToPoint,
  tileScale: arrayToPoint,
};

export const tilingSpritePropertyExtension: DefaultPropertyExtension = {
  extension: {
    type: 'sceneProperties',
    name: 'default-tiling-sprite-properties',
    priority: 0,
  },
  properties() {
    return getProps(v7TilingSpriteProps, v8TilingSpriteProps);
  },
  testNode(container) {
    return isTilingSprite(container, PixiDevtools.pixi);
  },
  testProp(prop: string) {
    return this.properties().some((p) => prop.startsWith(p.prop));
  },
  getProperties(container) {
    const activeProps = this.properties().reduce((result, property) => {
      const prop = property.prop;
      let value = container[prop as keyof Container];

      if (value != null && propertyValueExtractors[prop as PropertyValueExtractors]) {
        value = propertyValueExtractors[prop as PropertyValueExtractors](value);
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
  setProperty(container, prop, value) {
    // set the property on the container
    if (propertyValueSetters[prop as PropertyValueExtractors]) {
      propertyValueSetters[prop as PropertyValueExtractors](container, prop, value);
    } else {
      (container as any)[prop] = value;
    }
  },
};
