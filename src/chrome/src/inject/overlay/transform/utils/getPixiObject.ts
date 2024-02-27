import { getPixiWrapper } from '@chrome/src/inject/devtool';

export function getPixiObject<T extends keyof typeof import('pixi.js')>(type: T) {
  const pixi = getPixiWrapper().pixi();

  return pixi[type];
}
