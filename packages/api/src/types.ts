import type { Container, Renderer, Application } from 'pixi.js';
import type { OverlayExtension } from './extensions/overlay';
export interface DevtoolApp extends DevtoolPixi {
  app: Application;
}

export interface DevtoolRenderer extends DevtoolPixi {
  renderer: Renderer;
  stage: Container;
}

interface DevtoolPixi {
  pixi?: typeof import('pixi.js');
  plugins?: OverlayExtension[];
}

export type DevtoolsAPI = DevtoolApp | DevtoolRenderer;
export type Devtools = Partial<DevtoolApp & DevtoolRenderer>;
