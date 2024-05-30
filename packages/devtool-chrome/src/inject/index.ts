// Note: this file is compiled to `dist/content-inject/index.js` and is used by the content script

import { PixiDevtools } from '@devtool/backend/pixi';
import { pollPixi } from '@devtool/backend/utils/poller';
import { convertPostMessage } from '../messageUtils';
import { DevtoolMessage } from '@devtool/frontend/types';

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
