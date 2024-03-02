import { Devtools } from './types';

export * from './types';

export async function initDevtools(opts: Devtools) {
  if (!opts.app && !opts.renderer && !opts.stage) {
    throw new Error('You must provide either an app or a renderer and stage');
  }
  if (opts.app) {
    opts.renderer = opts.app.renderer as import('pixi.js').Renderer;
    opts.stage = opts.app.stage;
  }

  if (!opts.pixi) {
    opts.pixi = await import('pixi.js');
  }

  window.__PIXI_DEVTOOLS__ = {
    pixi: opts.pixi,
    app: opts.app,
    stage: opts.stage,
    renderer: opts.renderer,
  };
}
