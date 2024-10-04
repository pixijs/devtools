// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../global.d.ts" />
import type { Devtools } from './types';

export * from './extensions/ext';
export * from './extensions/overlay';
export * from './extensions/properties';
export * from './extensions/stats';
export * from './extensions/tree';
export * from './types';

export async function initDevtools(opts: Devtools) {
  const options: Devtools = {
    importPixi: false,
    ...opts,
  };

  if (options.app) {
    options.renderer = options.app.renderer;
    options.stage = options.app.stage;
  }

  if (options.importPixi && !options.pixi) {
    options.pixi = await import('pixi.js');
  }

  window.__PIXI_DEVTOOLS__ = {
    ...(window.__PIXI_DEVTOOLS__ || {}),
    app: options.app,
    stage: options.stage,
    renderer: options.renderer,
    version: options.version,
    extensions: [...(window.__PIXI_DEVTOOLS__?.extensions || []), ...(options.extensions || [])],
    plugins: {},
  };
}
