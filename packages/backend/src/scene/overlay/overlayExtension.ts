import type { OverlayExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';
import { isParticleContainer } from '../../utils/getPixiType';

export const overlayExtension: OverlayExtension = {
  extension: {
    type: 'overlay',
    priority: -1,
    name: 'default-overlay',
  },

  getSelectedStyle() {
    return {
      backgroundColor: 'hsla(340 70% 44% / 35%)',
      border: '1px solid hsla(0, 0%, 100%, 0.5)',
    };
  },

  getHoverStyle() {
    return {
      backgroundColor: 'hsla(192 84% 40% / 40%)',
      border: '1px solid hsla(0, 0%, 100%, 0.5)',
    };
  },

  getGlobalBounds(node: Container) {
    if (isParticleContainer(node)) {
      if (node.boundsArea) return node.boundsArea;
      // unknown bounds
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    return node.getBounds();
  },
};
