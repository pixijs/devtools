// Function to check if a global variable exists
function hasGlobal(varname: string) {
  return window[varname as keyof Window] || Array.from(window.frames).some((frame) => frame[varname as keyof Window]);
}

// Function to detect PixiJS
function detectPixi() {
  return hasGlobal('__PIXI_APP__') || hasGlobal('__PIXI_STAGE__') || hasGlobal('__PIXI_RENDERER__')
    ? 'detected'
    : 'disabled';
}

let pixiPollingInterval: number | undefined;

// Function to start polling for PixiJS
function startPixiPolling() {
  pixiPollingInterval = window.setInterval(() => {
    try {
      const pixiDetectionResult = detectPixi();

      if (pixiDetectionResult === 'detected') {
        clearInterval(pixiPollingInterval);
        window.postMessage({ type: 'pixi-detected' }, '*');
      }
    } catch (error) {
      clearInterval(pixiPollingInterval);
    }
  }, 300);

  return pixiPollingInterval;
}

startPixiPolling();
