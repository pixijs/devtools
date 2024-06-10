import type { Application, Container, Renderer } from 'pixi.js';
import type { OverlayExtension } from './dist/extensions/overlay';
import type { StatsExtension } from './dist/extensions/stats';
import type { TreeExtension } from './dist/extensions/tree';
import type { PropertiesExtension } from './dist/extensions/properties';
import type { NodeExtension } from './dist/extensions/node';
import type { PixiDevtools } from './dist/pixi';

declare global {
  interface Window {
    __PIXI_APP__: Application | undefined;
    __PIXI_STAGE__: Container | undefined;
    __PIXI_RENDERER__: Renderer | undefined;
    __PIXI__: typeof import('pixi.js');
    PIXI: typeof import('pixi.js');
    __PIXI_DEVTOOLS_WRAPPER__: PixiDevtools;
    __PIXI_DEVTOOLS__: {
      pixi: typeof import('pixi.js');
      app?: Application | undefined;
      stage?: Container | undefined;
      renderer?: Renderer | undefined;
      plugins?: (OverlayExtension | StatsExtension | TreeExtension | PropertiesExtension | NodeExtension)[];
    };
    $pixi: Container | null;
  }

  namespace PixiMixins {
    interface Container {
      __devtoolIgnore?: boolean;
      __devtoolIgnoreChildren?: string;
      __devtoolLocked?: boolean;
    }
  }

  namespace GlobalMixins {
    interface Container {
      __devtoolIgnore?: boolean;
      __devtoolIgnoreChildren?: string;
      __devtoolLocked?: boolean;
    }
  }
}

export {};
