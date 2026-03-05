import { DevtoolMessage } from '@devtool/frontend/types';
import { convertPostMessage } from '../messageUtils';

function onPanelCreated(panel: chrome.devtools.panels.ExtensionPanel) {
  const tabId = chrome.devtools.inspectedWindow.tabId;

  panel.onShown.addListener(() => {
    const message = convertPostMessage(DevtoolMessage.panelShown, {});
    chrome.runtime.sendMessage({ ...message, tabId });
  });

  panel.onHidden.addListener(() => {
    const message = convertPostMessage(DevtoolMessage.panelHidden, {});
    chrome.runtime.sendMessage({ ...message, tabId });
  });
}

const title = import.meta.env.DEV ? 'Dev: PixiJS DevTools' : 'PixiJS DevTools';

// Firefox: browser.devtools.panels.create() returns a Promise
// Chrome: chrome.devtools.panels.create() uses a callback
if (typeof browser !== 'undefined' && browser.devtools) {
  browser.devtools.panels.create(title, 'pixi-icon-active-128.png', 'devtools/panel/panel.html').then(onPanelCreated);
} else {
  chrome.devtools.panels.create(title, 'pixi-icon-active-128.png', 'devtools/panel/panel.html', onPanelCreated);
}
