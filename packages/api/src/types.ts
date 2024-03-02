import type { Container, Renderer, Application } from 'pixi.js';

export interface NodeTrackerPlugin {
  trackNode: (container: Container, state: Record<string, number>) => boolean;
  getKeys: () => string[];
}

export interface Devtools {
  app: Application;
  pixi?: typeof import('pixi.js');
  stage?: Container;
  renderer?: Renderer;
  plugins?: {
    stats?: NodeTrackerPlugin[];
  };
}
