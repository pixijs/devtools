declare global {
  interface Window {
    __PIXI_APP__: import('pixi.js').Application | undefined;
    __PIXI_STAGE__: import('pixi.js').Container | undefined;
    __PIXI_RENDERER__: import('pixi.js').Renderer | undefined;
    __PIXI__: typeof import('pixi.js');
    PIXI: typeof import('pixi.js');
    __PIXI_DEVTOOLS_WRAPPER__: any;
    __PIXI_DEVTOOLS__: {
      pixi: typeof import('pixi.js');
      app?: import('pixi.js').Application | undefined;
      stage?: import('pixi.js').Container | undefined;
      renderer?: import('pixi.js').Renderer | undefined;
      plugins?: {
        stats?: import('./dist/types').NodeTrackerPlugin[];
        properties?: import('./dist/types').PropertyPlugin[];
      };
    };
    $pixi: import('pixi.js').Container | null;
  }

  namespace PixiMixins {
    interface Container {
      __devtoolIgnore?: boolean;
      __devtoolIgnoreChildren?: string;
    }
  }

  namespace GlobalMixins {
    interface Container {
      __devtoolIgnore?: boolean;
      __devtoolIgnoreChildren?: string;
    }
  }
}

export {};
