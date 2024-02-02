import React, { useEffect } from 'react';
import './index.css';

export type BridgeFn = <T>(code: string) => Promise<T>;
interface PanelProps {
  bridge: BridgeFn;
}
const Panel: React.FC<PanelProps> = ({ bridge }) => {
  // listen to messages from the background script
  useEffect(() => {
    const messageListener = (request: Message, _sender: chrome.runtime.MessageSender) => {
      // Handle the message here
      console.log(request);
    };

    // Add the listener
    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return <div className="Panel">hello worlds</div>;
};

export default Panel;
