import type { OverlayExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';

export const overlayExtension: OverlayExtension = {
  extension: {
    type: 'overlay',
    priority: -1,
    name: 'default-overlay',
  },

  selectedColor: 'hsla(340 70% 44% / 35%)',
  hoverColor: 'hsla(192 84% 40% / 40%)',

  getGlobalPosition(node: Container) {
    const bounds = node.getLocalBounds();
    const wt = node.worldTransform;

    return {
      transform: wt,
      bounds,
    };
  },
};
