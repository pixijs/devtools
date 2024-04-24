import { convertPostMessage, convertPostMessageData } from '../messageUtils';

function injectScript(file_path: string, tag: string) {
  const node = document.getElementsByTagName(tag)[0];

  if (!node) {
    console.error('[Pixi Devtool] Failed to inject script, please submit an issue');
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

if (document.readyState === 'loading') {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', function () {
    injectScript(chrome.runtime.getURL('inject/index.js'), 'body');
  });
} else {
  // `DOMContentLoaded` has already fired
  injectScript(chrome.runtime.getURL('inject/index.js'), 'body');
}

window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window || !event.data.method) {
      return;
    }

    const converted = convertPostMessageData(event.data);

    if (!converted.method.startsWith('pixi-')) return;
    // pass the message to the background
    const message = convertPostMessage(converted.method, converted.data);
    chrome.runtime.sendMessage(message);
  },
  false,
);
