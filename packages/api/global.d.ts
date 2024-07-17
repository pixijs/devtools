/* eslint-disable no-var */
import type { Application, Container, Renderer } from 'pixi.js';
import type { OverlayExtension } from './dist/extensions/overlay';
import type { StatsExtension } from './dist/extensions/stats';
import type { TreeExtension } from './dist/extensions/tree';
import type { PropertiesExtension } from './dist/extensions/properties';
import type { NodeExtension } from './dist/extensions/node';
import type { PixiDevtools } from './dist/pixi';

declare global {
  var __PIXI_APP_INIT__: (arg: Application | Renderer) => void;
  var __PIXI_RENDERER_INIT__: (arg: Application | Renderer) => void;

  interface Window {
    __PIXI_APP__: Application | undefined;
    __PIXI_STAGE__: Container | undefined;
    __PIXI_RENDERER__: Renderer | undefined;
    __PIXI__: typeof import('pixi.js');
    PIXI: typeof import('pixi.js');
    __PIXI_DEVTOOLS_WRAPPER__: PixiDevtools;
    __PIXI_DEVTOOLS__: {
      pixi?: typeof import('pixi.js');
      app?: Application | undefined;
      stage?: Container | undefined;
      renderer?: Renderer | undefined;
      /** @deprecated since 2.0.0 */
      plugins?: any;
      extensions?: (OverlayExtension | StatsExtension | TreeExtension | PropertiesExtension | NodeExtension)[];
    };
    $pixi: Container | null;
  }

  namespace PixiMixins {
    interface Container {
      __devtoolIgnore?: boolean;
      __devtoolIgnoreChildren?: string;
      __devtoolLocked?: boolean;
    }

    interface WebGLSystems {
      __devtoolInjected?: boolean;
    }

    interface WebGPUSystems {
      __devtoolInjected?: boolean;
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
