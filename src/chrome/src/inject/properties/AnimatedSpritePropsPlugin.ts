import { AnimatedSprite } from 'pixi.js';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { PropertyPlugin } from './propertyTypes';

export const AnimatedSpritePropsPlugin: PropertyPlugin<AnimatedSprite> = {
  ...ContainerPropsPlugin,
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }

    if (prop === 'start' || prop === 'stop' || prop === 'play') {
      return { value: true, prop };
    }

    return { value: container[prop as keyof AnimatedSprite], prop };
  },
  setPropValue(container, prop, value) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return;
    }

    if (prop === 'start') {
      container.gotoAndPlay(0);
    } else if (prop === 'stop') {
      container.stop();
    } else if (prop === 'play') {
      container.play();
    } else {
      (container as any)[prop] = value;
    }
  },
  props: [
    { section: 'Transform', property: 'roundPixels', propertyProps: { label: 'Round Pixels' }, type: 'boolean' },
    // { section: 'Animated Sprite', property: 'textures', propertyProps: { label: 'Textures' }, type: 'text' },
    { section: 'Animated Sprite', property: 'animationSpeed', propertyProps: { label: 'Animation Speed' }, type: 'number' },
    { section: 'Animated Sprite', property: 'loop', propertyProps: { label: 'Loop' }, type: 'boolean' },
    { section: 'Animated Sprite', property: 'updateAnchor', propertyProps: { label: 'Update Anchor' }, type: 'boolean' },
    { section: 'Animated Sprite', property: 'totalFrames', propertyProps: { label: 'Total Frames' }, type: 'number' },
    { section: 'Animated Sprite', property: 'currentFrame', propertyProps: { label: 'Current Frame' }, type: 'number' },
    { section: 'Animated Sprite', property: 'autoUpdate', propertyProps: { label: 'Auto Update' }, type: 'boolean' },
    { section: 'Animated Sprite', property: 'playing', propertyProps: { label: 'Playing' }, type: 'boolean' },
    { section: 'Animated Sprite', property: 'start', propertyProps: { label: 'Start' }, type: 'button' },
    { section: 'Animated Sprite', property: 'stop', propertyProps: { label: 'Stop' }, type: 'button' },
    { section: 'Animated Sprite', property: 'play', propertyProps: { label: 'Play' }, type: 'button' },
  ],
};
