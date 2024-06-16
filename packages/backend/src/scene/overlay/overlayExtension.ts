import type { OverlayExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';

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
    return node.getBounds();
  },
};
