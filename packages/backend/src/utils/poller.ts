import { DevtoolMessage } from '@devtool/frontend/types';
import { PixiDevtools } from '../pixi';

// Constants
const MAX_TRIES = 10;
const POLLING_INTERVAL_MS = 1000;

let pixiPollingInterval: number | undefined;
let tryCount = 0;

// Function to start polling for PixiJS
export function pollPixi(foundCallback: () => void, loopCallback?: () => void, stopCallback?: () => void) {
  // Start a new interval
  pixiPollingInterval = window.setInterval(() => {
    // If we've tried more than the max tries, stop polling
    if (tryCount > MAX_TRIES) {
      stopPolling();
      if (stopCallback) {
        stopCallback();
      }
      return;
    }

    // If a loop callback is provided, call it
    if (loopCallback) {
      loopCallback();
    }
    // Try to detect Pixi
    tryDetectPixi(foundCallback);

    // Increment the try count
    tryCount += 1;
  }, POLLING_INTERVAL_MS);

  // Return the interval ID
  return pixiPollingInterval;
}

// Function to stop polling
function stopPolling() {
  if (pixiPollingInterval) {
    clearInterval(pixiPollingInterval);
  }
}

// Function to try to detect Pixi
function tryDetectPixi(foundCallback: () => void) {
  try {
    const pixiDetectionResult = PixiDevtools.isPixiActive;

    // If Pixi is active, stop polling and post a message
    if (pixiDetectionResult === DevtoolMessage.active) {
      stopPolling();
      foundCallback();
    } else {
      window.postMessage({ method: pixiDetectionResult, data: JSON.stringify({}) }, '*');
    }
  } catch (error) {
    // If an error occurred, stop polling
    stopPolling();
  }
}
