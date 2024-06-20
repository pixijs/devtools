// Note: this file is compiled to `dist/content-inject/index.js` and is used by the content script

import { PixiDevtools } from '@devtool/backend/pixi';
import { pollPixi } from '@devtool/backend/utils/poller';
import { convertPostMessage } from '../messageUtils';
import { DevtoolMessage } from '@devtool/frontend/types';
import type { Application, Renderer } from 'pixi.js';

function attach() {
  const renderer = PixiDevtools.renderer;

  if (renderer) {
    renderer.render = new Proxy(renderer.render, {
      apply(target, thisArg, ...args) {
        PixiDevtools.update();
        // @ts-expect-error - TODO: fix this type
        return target.apply(thisArg, ...args);
      },
    });
  }

  window.postMessage(convertPostMessage(DevtoolMessage.active, {}), '*');
}

pollPixi(attach);

function init(arg: Application | Renderer) {
  const stage = (arg as Application).stage;
  const renderer = stage ? (arg as Application).renderer : (arg as Renderer);
  window.__PIXI_DEVTOOLS__ = {
    ...window.__PIXI_DEVTOOLS__,
    renderer,
    stage,
  };
  window.__PIXI_DEVTOOLS_WRAPPER__?.reset();
}
window.__PIXI_APP_INIT__ = init;
window.__PIXI_RENDERER_INIT__ = init;
