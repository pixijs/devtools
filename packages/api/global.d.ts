declare global {
  interface Window {
    __PIXI_APP__: import('pixi.js').Application | undefined;
    __PIXI_STAGE__: import('pixi.js').Container | undefined;
    __PIXI_RENDERER__: import('pixi.js').Renderer | undefined;
    __PIXI__: import('pixi.js');
    PIXI: import('pixi.js');
    __PIXI_DEVTOOLS_WRAPPER__: any;
    __PIXI_DEVTOOLS__: {
      pixi: typeof import('pixi.js');
      app: import('pixi.js').Application | undefined;
      stage?: import('pixi.js').Container | undefined;
      renderer?: import('pixi.js').Renderer | undefined;
      scenePanel?: {
        propertyPlugins?: any[];
      };
    };
  }
}

export {};
