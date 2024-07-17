// Note: this file is compiled to `dist/content-inject/index.js` and is used by the content script

import { pollPixi } from '@devtool/backend/utils/poller';
import { DevtoolMessage } from '@devtool/frontend/types';
import { convertPostMessage } from '../messageUtils';
import type { Application, Renderer } from 'pixi.js';

function attach() {
  window.postMessage(convertPostMessage(DevtoolMessage.active, {}), '*');
}
function injectIFrames() {
  if (window.frames) {
    for (let i = 0; i < window.frames.length; i += 1) {
      try {
        const frame = window.frames[i] as Window & typeof globalThis;
        frame.__PIXI_APP_INIT__ = init;
        frame.__PIXI_RENDERER_INIT__ = init;
      } catch (_) {
        // access to iframe was denied
      }
    }
  }
  window.__PIXI_APP_INIT__ = init;
  window.__PIXI_RENDERER_INIT__ = init;

  return null;
}
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

// try injecting iframes using requestAnimationFrame until poller is stopped
const inject = () => {
  injectIFrames();
  requestAnimationFrame(inject);
};

inject();

pollPixi(attach);
