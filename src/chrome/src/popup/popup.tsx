import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';

const Popup = () => {
  const [message, setMessage] = useState('hello world');

  // send a message to the background script to let it know the popup has been opened
  // background script will then send a message back if it detects pixi
  useEffect(() => {
    chrome.runtime.sendMessage({ method: 'popup-opened' });
  }, []);

  // listen for messages from the background script
  useEffect(() => {
    const listener = (request: any) => {
      if (request.method === 'pixi-detected') {
        setMessage(request.data);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  return <div>{message}</div>;
};

const container = document.getElementById('app-container');
const root = createRoot(container!);
root.render(<Popup />);