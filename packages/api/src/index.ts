// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../global.d.ts" />
import { Devtools, DevtoolsAPI } from './types';

export * from './propertyPlugin';
export * from './nodeTrackerPlugin';
export * from './treePlugin';
export * from './types';

export async function initDevtools(opts: DevtoolsAPI) {
  const castOpts = opts as Devtools;

  if (!castOpts.app && !castOpts.renderer && !castOpts.stage) {
    throw new Error('You must provide either an app or a renderer and stage');
  }
  if (castOpts.app) {
    castOpts.renderer = castOpts.app.renderer;
    castOpts.stage = castOpts.app.stage;
  }

  if (!castOpts.pixi) {
    castOpts.pixi = await import('pixi.js');
  }

  window.__PIXI_DEVTOOLS__ = {
    pixi: castOpts.pixi,
    app: castOpts.app,
    stage: castOpts.stage,
    renderer: castOpts.renderer,
    plugins: castOpts.plugins,
  };
}
