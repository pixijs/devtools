// Note: this file is compiled to `dist/content-inject/index.js` and is used by the content script

import { PixiDevtools } from './pixi';
import { pollPixi } from './utils/poller';

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
}

pollPixi(attach);
