import type { PropertiesEntry, PropertiesExtension } from '@pixi/devtools';
import { PixiDevtools } from '../../../../pixi';
import type { AnimatedSprite } from 'pixi.js';
import { isAnimatedSprite } from '../../../../utils/getPixiType';
import { sharedAnimatedSpriteProps } from './sharedAnimatedSpriteProps';

export const animatedSpritePropertyExtension: PropertiesExtension = {
  extension: {
    type: 'sceneProperties',
    name: 'default-animated-sprite-properties',
    priority: 0,
  },
  properties() {
    return sharedAnimatedSpriteProps;
  },
  testNode(container: AnimatedSprite) {
    return isAnimatedSprite(container, PixiDevtools.pixi);
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

      if (value != null && (prop === 'gotoAndPlay' || prop === 'stop' || prop === 'play')) {
        value = true;
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
    if (prop === 'gotoAndPlay') {
      container.gotoAndPlay(0);
    } else if (prop === 'stop') {
      container.stop();
    } else if (prop === 'play') {
      container.play();
    } else {
      (container as any)[prop] = value;
    }
  },
  copyProperty() {
    // copy the property from the container
    console.error('Not implemented');
  },
};
