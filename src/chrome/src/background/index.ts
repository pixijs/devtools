import { MessageType, convertPostMessage, convertPostMessageData } from '../messageUtils';

interface Message {
  method: MessageType;
  data: string;
}

interface IconPath {
  [key: number]: string;
}

function setIconAndPopup(type: MessageType, tabId: number) {
  const iconPath: IconPath = {
    16: `./icon-${type}-16.png`,
    32: `./icon-${type}-32.png`,
    48: `./icon-${type}-48.png`,
    128: `./icon-${type}-128.png`,
  };

  const title = type === MessageType.Inactive ? 'PixiJS not active on this page' : 'PixiJS active on this page';

  chrome.action.setIcon({ tabId, path: iconPath });
  chrome.action.setTitle({ tabId, title });
}

let devToolsConnection: chrome.runtime.Port | null = null;

chrome.runtime.onMessage.addListener((request: Message, sender: chrome.runtime.MessageSender) => {
  const converted = convertPostMessageData(request);
  if (converted.method === MessageType.PixiDetected) {
    setIconAndPopup(MessageType.Active, sender.tab?.id ?? 0);
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

  console.log('Connected to devtools', port);
});

// update icon and popup when the active tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'loading') {
    setIconAndPopup(MessageType.Inactive, tabId);
    const message = convertPostMessage(MessageType.Inactive, {});
    devToolsConnection?.postMessage({
      id: 'pixi-devtools',
      ...message,
    });
  }
});
