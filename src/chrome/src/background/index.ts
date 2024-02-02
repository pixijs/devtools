enum MessageType {
  Inactive = 'inactive',
  Active = 'active',
  PopupOpened = 'popup-opened',
  PixiDetected = 'pixi-detected',
}

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

function sendRuntimeMessage(method: MessageType, data: unknown) {
  const message: Message = { method, data: JSON.stringify(data) };
  chrome.runtime.sendMessage(message);
}

let devToolsConnection: chrome.runtime.Port | null = null;
let popupTabId: string | null = null;

chrome.runtime.onMessage.addListener((request: Message, sender: chrome.runtime.MessageSender) => {
  console.log('Message received in background script', request, sender);
  if (request.method === MessageType.PopupOpened) {
    sendRuntimeMessage(MessageType.PixiDetected, { data: MessageType.PopupOpened });
    popupTabId = sender.id ?? null;
  } else if (request.method === MessageType.PixiDetected) {
    setIconAndPopup(MessageType.Active, sender.tab?.id ?? 0);
    if (popupTabId) {
      sendRuntimeMessage(MessageType.PixiDetected, request.data);
    }
  }

  // Forward the message to the devtools
  devToolsConnection?.postMessage(request);
});

chrome.runtime.onConnect.addListener(function (dtc) {
  // assign the listener function to a variable so we can remove it later
  const devToolsListener = function () {
    // Handle message from devtools here
  };
  // add the listener
  dtc.onMessage.addListener(devToolsListener);

  dtc.onDisconnect.addListener(function () {
    dtc.onMessage.removeListener(devToolsListener);
  });

  devToolsConnection = dtc;
});
