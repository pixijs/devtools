import type { Properties, PropertiesEntry, PropertiesExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';
import {
  arrayToBounds,
  arrayToMatrix,
  arrayToPoint,
  boundsToArray,
  matrixToArray,
  pointToArray,
} from '../utils/convertProp';
import { v7BlendModeMap, v7ContainerProps } from './v7ContainerProps';
import { v8ContainerProps } from './v8ContainerProps';
import { getProps } from '../utils/getProps';
import { PixiDevtools } from '../../../../pixi';

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

export interface DefaultPropertyExtension extends PropertiesExtension {
  properties: () => Properties[];
}

export const containerPropertyExtension: DefaultPropertyExtension = {
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
      } else if (prop === 'blendMode' && PixiDevtools.majorVersion === '7') {
        value = Object.keys(v7BlendModeMap).find((key) => v7BlendModeMap[key as keyof typeof v7BlendModeMap] === value);
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
    } else if (prop === 'blendMode' && PixiDevtools.majorVersion === '7') {
      // convert string to blendmode number
      (container as any)[prop] = v7BlendModeMap[value as keyof typeof v7BlendModeMap];
    } else {
      (container as any)[prop] = value;
    }
  },
};
