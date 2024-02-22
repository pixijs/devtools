import { MessageType, convertPostMessage } from '../../messageUtils';
import { getPixiWrapper } from '../devtool';

let pixiPollingInterval: number | undefined;
let tryCount = 0;

// Function to start polling for PixiJS
export function pollPixi() {
  pixiPollingInterval = window.setInterval(() => {
    if (tryCount > 10) {
      clearInterval(pixiPollingInterval);
      return;
    }
    try {
      const pixiDetectionResult = getPixiWrapper().detectPixi();

      if (pixiDetectionResult === MessageType.Active) {
        clearInterval(pixiPollingInterval);
        window.postMessage(convertPostMessage(MessageType.PixiDetected, {}), '*');
      }

      tryCount += 1;
    } catch (error) {
      clearInterval(pixiPollingInterval);
    }
  }, 1000);

  return pixiPollingInterval;
}
