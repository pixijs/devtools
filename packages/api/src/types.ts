import type { Container, Renderer, Application } from 'pixi.js';
import type { OverlayExtension } from './extensions/overlay';

/** @deprecated since 2.0.0 */
export interface DevtoolApp extends DevtoolPixi {
  app: Application;
}

/** @deprecated since 2.0.0 */
export interface DevtoolRenderer extends DevtoolPixi {
  renderer: Renderer;
  stage: Container;
}

interface DevtoolPixi {
  pixi?: typeof import('pixi.js');
  importPixi?: boolean;
  extensions?: OverlayExtension[];
  /** @deprecated since 2.0.0 */
  plugins?: any;
}

/** @deprecated since 2.0.0 */
export type DevtoolsAPI = DevtoolApp | DevtoolRenderer;

/**
 * The options for the devtools
 */
export interface Devtools extends DevtoolPixi {
  app?: Application;
  renderer?: Renderer;
  stage?: Container;
  version?: string;
}
