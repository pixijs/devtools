import type { OverlayExtension } from '@pixi/devtools';
import { ExtensionPriority } from '@pixi/devtools';
import type { Container } from 'pixi.js';

export const overlayExt: OverlayExtension = {
  extension: {
    type: 'overlay',
    priority: ExtensionPriority.Low,
    name: 'overlay',
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
