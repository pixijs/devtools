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

const devtoolConnections: Record<string, chrome.runtime.Port> = {};

// Create a connection to the background page
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== 'devtools-connection') return;

  const extensionListener = function (message: any) {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.name == 'init') {
      devtoolConnections[message.tabId] = port;
      return;
    }
  };

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener);

    const tabs = Object.keys(devtoolConnections);
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (devtoolConnections[tabs[i]] === port) {
        delete devtoolConnections[tabs[i]];
        break;
      }
    }
  });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener((request: Message, sender: chrome.runtime.MessageSender, sendResponse) => {
  const converted = convertPostMessageData(request);
  if (converted.method === DevtoolMessage.active) {
    setIconAndPopup(DevtoolMessage.active, sender.tab?.id ?? 0);
  }

  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    const tabId = sender.tab.id!;
    if (tabId in devtoolConnections) {
      const message = convertPostMessage(converted.method, converted.data);
      devtoolConnections[tabId].postMessage({
        id: 'pixi-devtools',
        tabId: sender.tab?.id,
        ...message,
      });
      // Send a response back to the sender
      sendResponse({ status: 'success' });
    } else {
      console.log('Tab not found in connection list.');
      sendResponse({ status: 'error', message: 'Tab not found in connection list.' });
    }
  } else {
    console.log('sender.tab not defined.');
    sendResponse({ status: 'error', message: 'sender.tab not defined.' });
  }
  return true;
});

// update icon and popup when the active tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'loading') {
    setIconAndPopup(DevtoolMessage.inactive, tabId);
    if (tabId in devtoolConnections) {
      const message = convertPostMessage(DevtoolMessage.inactive, {});
      devtoolConnections[tabId].postMessage({
        id: 'pixi-devtools',
        tabId,
        ...message,
      });
    }
  }
  if (tab.active && changeInfo.status === 'complete') {
    // TODO: we can send a message to the devtools to reload the page
    console.log(`Tab ${tabId} has reloaded.`);
    // You can perform additional actions here
  }
});
