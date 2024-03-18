import { PropertyPlugin } from '@pixi/devtools';
import type { AnimatedSprite } from 'pixi.js';
import { ContainerPropertiesPlugin } from './ContainerProperties';

export const AnimatedSpritePropertiesPlugin: PropertyPlugin = {
  updateProps(sprite: AnimatedSprite) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof AnimatedSprite | string;
      const value = sprite[prop as keyof AnimatedSprite] as any;

      if (value != null && (prop === 'start' || prop === 'stop' || prop === 'play')) {
        property.value = true;
      } else if (value != null && prop === 'anchor') {
        property.value = [value.x, value.y];
      } else {
        property.value = value;
      }
    });

    return this.props;
  },
  containsProperty: ContainerPropertiesPlugin.containsProperty,
  setValue(sprite: AnimatedSprite, prop: string, value: any) {
    prop = prop as keyof AnimatedSprite;
    if (prop === 'start') {
      sprite.gotoAndPlay(0);
    } else if (prop === 'stop') {
      sprite.stop();
    } else if (prop === 'play') {
      sprite.play();
    } else {
      (sprite as any)[prop] = value;
    }
  },
  props: [
    {
      value: null,
      prop: 'anchor',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    { value: null, prop: 'roundPixels', entry: { section: 'Transform', type: 'boolean' } },
    // { section: 'Animated Sprite', property: 'textures', propertyProps: { label: 'Textures' }, type: 'text' },
    { value: null, prop: 'animationSpeed', entry: { section: 'Animated Sprite', type: 'number' } },
    { value: null, prop: 'loop', entry: { section: 'Animated Sprite', type: 'boolean' } },
    { value: null, prop: 'updateAnchor', entry: { section: 'Animated Sprite', type: 'boolean' } },
    { value: null, prop: 'totalFrames', entry: { section: 'Animated Sprite', type: 'number' } },
    { value: null, prop: 'currentFrame', entry: { section: 'Animated Sprite', type: 'number' } },
    { value: null, prop: 'autoUpdate', entry: { section: 'Animated Sprite', type: 'boolean' } },
    { value: null, prop: 'playing', entry: { section: 'Animated Sprite', type: 'boolean' } },
    { value: null, prop: 'start', entry: { section: 'Animated Sprite', type: 'button' } },
    { value: null, prop: 'stop', entry: { section: 'Animated Sprite', type: 'button' } },
    { value: null, prop: 'play', entry: { section: 'Animated Sprite', type: 'button' } },
  ],
};
