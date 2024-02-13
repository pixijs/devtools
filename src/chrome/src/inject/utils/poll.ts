import { MessageType, convertPostMessage } from '../../messageUtils';
import { getPixiWrapper } from '../devtool';

let pixiPollingInterval: number | undefined;

// Function to start polling for PixiJS
export function pollPixi() {
  pixiPollingInterval = window.setInterval(() => {
    try {
      const pixiDetectionResult = getPixiWrapper().detectPixi();

      if (pixiDetectionResult === MessageType.Active) {
        clearInterval(pixiPollingInterval);
        window.postMessage(convertPostMessage(MessageType.PixiDetected, {}), '*');
      }
    } catch (error) {
      clearInterval(pixiPollingInterval);
    }
  }, 300);

  return pixiPollingInterval;
}
