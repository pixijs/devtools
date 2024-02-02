function injectScript(file_path: string, tag: string) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}
injectScript(chrome.runtime.getURL('src/inject/index.js'), 'body');

window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return;
    }

    if (event.data?.type === 'pixi-detected') {
      chrome.runtime.sendMessage({ method: 'pixi-detected', data: JSON.stringify(event.data) });
    }
  },
  false
);
