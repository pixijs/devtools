import { MessageType, convertPostMessageData } from '../messageUtils';
import { getPixiWrapper, resetPixiState } from './devtool';
import { sceneGraphMap, updateSceneGraph } from './updateSceneGraph';
import { updateSceneStats } from './updateSceneStats';
import { loop } from './utils/loop';
import { pollPixi } from './utils/poll';
import { Throttle } from './utils/throttle';

const throttle = new Throttle();

// listen to the postMessage event
window.addEventListener('message', (event) => {
  // We only accept messages from ourselves
  if (event.source !== window) {
    return;
  }

  if (!event.data.method) {
    return;
  }

  const converted = convertPostMessageData(event.data);

  if (converted.method === MessageType.PixiDetected) {
    const pixiWrapper = getPixiWrapper();
    const renderer = pixiWrapper.renderer()!;

    renderer.render = new Proxy(renderer.render, {
      apply(target, thisArg, args) {
        const res = target.apply(thisArg, args as any);

        // update the overlay
        pixiWrapper.overlay().update();

        if (throttle.shouldExecute(100)) {
          resetPixiState();
          pixiWrapper.state().version = pixiWrapper.version();
          if (renderer.lastObjectRendered === pixiWrapper.stage()) {
            // loop through the children of the stage
            sceneGraphMap.clear();
            loop({
              container: pixiWrapper.stage()!,
              loop: (container, parent) => {
                updateSceneStats(container);
                updateSceneGraph(container, parent);
              },
            });
          }

          pixiWrapper.properties.updateSelectedNodes();

          window.postMessage({ method: MessageType.StateUpdate, data: JSON.stringify(pixiWrapper.state()) }, '*');
        }
        return res;
      },
    });
  }
});

pollPixi();
