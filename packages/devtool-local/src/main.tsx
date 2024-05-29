import App from '@devtool/frontend/App';
import type { BridgeFn } from '@devtool/frontend/lib/utils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PixiDevtools } from '../../devtool-chrome/src/inject/pixi';
import scene from './scene.ts';
import * as PIXI from 'pixi.js';

(async () => {
  // wait for the app to be ready
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const app = await scene(canvas);

  window.__PIXI_DEVTOOLS__ = {
    pixi: PIXI,
    app,
  };

  const renderer = PixiDevtools.renderer;

  if (renderer) {
    renderer.render = new Proxy(renderer.render, {
      apply(target, thisArg, ...args) {
        PixiDevtools.update();
        messageListeners.forEach((listener) =>
          listener({
            method: 'pixi-state-update',
            data: JSON.stringify(PixiDevtools.state),
          }),
        );
        // @ts-expect-error - TODO: fix this type
        return target.apply(thisArg, ...args);
      },
    });
  }
})();

const messageListeners: ((message: unknown) => void)[] = [];
const mockChrome = {
  runtime: {
    connect: () => ({
      postMessage: () => {},
      onMessage: {
        addListener: (listner: (message: unknown) => void) => {
          messageListeners.push(listner);
        },
      },
    }),
  },
  devtools: {
    inspectedWindow: {
      tabId: 0,
      eval: (code: string, cb: () => void) => {
        eval(code);
        cb();
      },
    },
  },
} as unknown as typeof chrome;

const mockBridge: BridgeFn = (code): Promise<any> => {
  eval(code);
  return Promise.resolve();
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id="root" style={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh', alignItems: 'center' }}>
      <canvas id="canvas" style={{ width: '600px', height: '450px' }} />
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <App bridge={mockBridge} chromeProxy={mockChrome} />
      </div>
    </div>
  </React.StrictMode>,
);
