import type { Container, Renderer, Application } from 'pixi.js';
import { PropertyPlugin } from './propertyPlugin';
import { NodeTrackerPlugin } from './nodeTrackerPlugin';

export interface DevtoolApp extends DevtoolPixi {
  app: Application;
}

export interface DevtoolRenderer extends DevtoolPixi {
  renderer: Renderer;
  stage: Container;
}

interface DevtoolPixi {
  pixi?: typeof import('pixi.js');
  plugins?: {
    stats?: NodeTrackerPlugin[];
    properties?: PropertyPlugin[];
  };
}

export type DevtoolsAPI = DevtoolApp | DevtoolRenderer;
export type Devtools = Partial<DevtoolApp & DevtoolRenderer>;
