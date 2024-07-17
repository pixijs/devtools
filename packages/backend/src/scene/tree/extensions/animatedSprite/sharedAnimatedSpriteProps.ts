import type { Properties } from '@pixi/devtools';

export const sharedAnimatedSpriteProps = [
  { prop: 'animationSpeed', entry: { section: 'Animated Sprite', type: 'number' } },
  { prop: 'loop', entry: { section: 'Animated Sprite', type: 'boolean' } },
  { prop: 'updateAnchor', entry: { section: 'Animated Sprite', type: 'boolean' } },
  {
    prop: 'totalFrames',
    entry: { section: 'Animated Sprite', type: 'number', options: { disabled: true } },
  },
  { prop: 'currentFrame', entry: { section: 'Animated Sprite', type: 'number' } },
  { prop: 'autoUpdate', entry: { section: 'Animated Sprite', type: 'boolean' } },
  { prop: 'playing', entry: { section: 'Animated Sprite', type: 'boolean' } },
  {
    prop: 'gotoAndPlay',
    entry: { section: 'Animated Sprite', type: 'button', label: 'start' },
  },
  { prop: 'stop', entry: { section: 'Animated Sprite', type: 'button', label: 'stop' } },
  { prop: 'play', entry: { section: 'Animated Sprite', type: 'button', label: 'play' } },
] as Properties[];
