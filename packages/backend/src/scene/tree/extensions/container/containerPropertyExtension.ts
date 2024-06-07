import type { PropertiesEntry, PropertiesExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';
import {
  arrayToBounds,
  arrayToMatrix,
  arrayToPoint,
  boundsToArray,
  matrixToArray,
  pointToArray,
} from '../utils/convertProp';
import { v7ContainerProps } from './v7ContainerProps';
import { v8ContainerProps } from './v8ContainerProps';
import { getProps } from '../utils/getProps';

const propertyValueExtractors = {
  position: pointToArray,
  scale: pointToArray,
  pivot: pointToArray,
  skew: pointToArray,
  filterArea: boundsToArray,
  boundsArea: boundsToArray,
  cullArea: boundsToArray,
  hitArea: boundsToArray,
  worldTransform: matrixToArray,
} as const;

type PropertyValueExtractors = keyof typeof propertyValueExtractors;

const propertyValueSetters: Record<PropertyValueExtractors, any> = {
  position: arrayToPoint,
  scale: arrayToPoint,
  pivot: arrayToPoint,
  skew: arrayToPoint,
  filterArea: arrayToBounds,
  boundsArea: arrayToBounds,
  cullArea: arrayToBounds,
  hitArea: arrayToBounds,
  worldTransform: arrayToMatrix,
};

export const containerPropertyExtension: PropertiesExtension = {
  extension: {
    type: 'sceneProperties',
    name: 'default-container-properties',
    priority: 0,
  },
  properties() {
    return getProps(v7ContainerProps, v8ContainerProps);
  },
  testNode() {
    return true;
  },
  testProp(prop: string) {
    return this.properties().some((p) => prop.startsWith(p.prop));
  },
  getProperties(container) {
    const activeProps = this.properties().reduce((result, property) => {
      const prop = property.prop;
      let value = container[prop as keyof Container];

      if (prop === 'type') {
        value = container.constructor.name;
      } else if (value != null && propertyValueExtractors[prop as PropertyValueExtractors]) {
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
  copyProperty() {
    // copy the property from the container
    console.error('Not implemented');
  },
};