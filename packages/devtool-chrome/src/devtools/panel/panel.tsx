import App from '@devtool/frontend/App';
import type { BridgeFn } from '@devtool/frontend/lib/utils';

import { createRoot } from 'react-dom/client';

/**
 * Thanks pixi-inspector for this snippet
 * https://github.com/bfanger/pixi-inspector
 */
const bridge: BridgeFn = (code: string) =>
  new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(code, (result, err) => {
      if (err) {
        if (err instanceof Error) {
          reject(err);
        }
        reject(new Error(err.value || err.description || err.code));
      }
      resolve(result as any);
    });
  });

const container = document.getElementById('app-container');
const root = createRoot(container!);
root.render(<App bridge={bridge} chromeProxy={chrome} />);

if (import.meta.env.DEV) {
  new EventSource('http://localhost:10808').addEventListener('change', () => {
    bridge('window.location.reload()');
    window.location.reload();
  });
}
