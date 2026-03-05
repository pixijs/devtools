import App from '@devtool/frontend/App';
import type { BridgeFn } from '@devtool/frontend/lib/utils';

import { createRoot } from 'react-dom/client';

// Firefox exposes devtools APIs on `browser`, not `chrome`
const devtools = typeof browser !== 'undefined' && browser.devtools ? browser.devtools : chrome.devtools;

/**
 * Thanks pixi-inspector for this snippet
 * https://github.com/bfanger/pixi-inspector
 */
const bridge: BridgeFn = (code: string) => {
  // Firefox: browser.devtools.inspectedWindow.eval() returns a Promise
  if (typeof browser !== 'undefined' && browser.devtools) {
    return browser.devtools.inspectedWindow.eval(code).then(([result, err]: [any, any]) => {
      if (err) {
        throw new Error((err.value || err.description || err.code) + `\n${code}`);
      }
      return result;
    });
  }
  // Chrome: callback-based
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(code, (result, err) => {
      if (err) {
        if (err instanceof Error) {
          reject(err);
        }
        reject(new Error(err.value || err.description || err.code) + `\n${code}`);
      }
      resolve(result as any);
    });
  });
};

// Combine chrome.runtime with browser.devtools for cross-browser compat
const chromeProxy = { runtime: chrome.runtime, devtools } as typeof chrome;

const container = document.getElementById('app-container');
const root = createRoot(container!);
root.render(<App bridge={bridge} chromeProxy={chromeProxy} />);

if (import.meta.env.DEV) {
  new EventSource('http://localhost:10808').addEventListener('change', () => {
    bridge('window.location.reload()');
    window.location.reload();
  });
}
