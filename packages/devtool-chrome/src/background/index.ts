import { DevtoolMessage } from '@devtool/frontend/types';
import { convertPostMessage, convertPostMessageData } from '../messageUtils';

interface Message {
  method: DevtoolMessage;
  data: string;
}

interface IconPath {
  [key: number]: string;
}

function setIconAndPopup(type: DevtoolMessage, tabId: number) {
  const state = type === DevtoolMessage.active ? 'active' : 'inactive';
  const iconPath: IconPath = {
    16: `./icon-${state}-16.png`,
    48: `./icon-${state}-48.png`,
    128: `./icon-${state}-128.png`,
  };

  const title = type === DevtoolMessage.inactive ? 'PixiJS not active on this page' : 'PixiJS active on this page';

  chrome.action.setIcon({ tabId, path: iconPath });
  chrome.action.setTitle({ tabId, title });
}

let devToolsConnection: chrome.runtime.Port | null = null;

chrome.runtime.onMessage.addListener((request: Message, sender: chrome.runtime.MessageSender) => {
  const converted = convertPostMessageData(request);
  if (converted.method === DevtoolMessage.active) {
    setIconAndPopup(DevtoolMessage.active, sender.tab?.id ?? 0);
  }

  if (devToolsConnection) {
    const message = convertPostMessage(converted.method, converted.data);
    devToolsConnection?.postMessage({
      id: 'pixi-devtools',
      ...message,
    });
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== 'devtools-connection') return;

  devToolsConnection = port;
  devToolsConnection.onDisconnect.addListener(function () {
    devToolsConnection = null;
  });
});

// update icon and popup when the active tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'loading') {
    setIconAndPopup(DevtoolMessage.inactive, tabId);
    const message = convertPostMessage(DevtoolMessage.inactive, {});
    devToolsConnection?.postMessage({
      id: 'pixi-devtools',
      ...message,
    });
  }
});
