import { DevtoolMessage } from '@devtool/frontend/types';
import { convertPostMessage } from '../messageUtils';

const title = import.meta.env.DEV ? 'Dev: PixiJS DevTools' : 'PixiJS DevTools';

chrome.devtools.panels.create(title, 'pixi-icon-active-128.png', 'devtools/panel/panel.html', (panel) => {
  const tabId = chrome.devtools.inspectedWindow.tabId;

  panel.onShown.addListener(() => {
    const message = convertPostMessage(DevtoolMessage.panelShown, {});
    chrome.runtime.sendMessage({ ...message, tabId });
  });

  panel.onHidden.addListener(() => {
    const message = convertPostMessage(DevtoolMessage.panelHidden, {});
    chrome.runtime.sendMessage({ ...message, tabId });
  });
});
