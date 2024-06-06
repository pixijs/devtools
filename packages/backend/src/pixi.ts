import type { DevtoolState } from '@devtool/frontend/types';
import { DevtoolMessage } from '@devtool/frontend/types';
import type { Devtools } from '@pixi/devtools';
import type { Application, Container, Renderer } from 'pixi.js';
import { loop } from './utils/loop';
import { Stats } from './scene/stats/stats';
import { Tree } from './scene/tree/tree';
import { Properties } from './scene/tree/properties';
import { Throttle } from './utils/throttle';
import { Overlay } from './scene/overlay/overlay';
import { extensions } from './extensions/Extensions';
import { overlayExtension } from './scene/overlay/overlayExtension';
import { pixiStatsExtension, totalStatsExtension } from './scene/stats/statsExtension';
import { containerPropertyExtension } from './scene/tree/extensions/container/containerPropertyExtension';
import { animatedSpritePropertyExtension } from './scene/tree/extensions/animatedSprite/animatedSpritePropertyExtension';
import { viewPropertyExtension } from './scene/tree/extensions/view/viewPropertyExtension';
import { textPropertyExtension } from './scene/tree/extensions/text/textPropertyExtension';
import { nineSlicePropertyExtension } from './scene/tree/extensions/ninesliceSprite/ninesliceSpritePropertyExtension';
import { tilingSpritePropertyExtension } from './scene/tree/extensions/tilingSprite/tilingSpritePropertyExtension';

/**
 * PixiWrapper is a class that wraps around the PixiJS library.
 * It provides access to the main PixiJS objects such as the Application, Stage, Renderer, Canvas, and the PixiJS library itself.
 * It also provides a method to search for these objects in the window and its frames.
 */
class PixiWrapper {
  public settings = {
    throttle: 100,
  };
  public state: Omit<DevtoolState, 'active' | 'setActive' | 'bridge' | 'setBridge'> = {
    version: null,
    setVersion: function (version: DevtoolState['version']) {
      this.version = version;
    },

    sceneGraph: null,
    setSceneGraph: function (sceneGraph: DevtoolState['sceneGraph']) {
      this.sceneGraph = sceneGraph ?? {
        id: 'root',
        name: 'root',
        children: [],
        metadata: {
          type: 'Container',
        },
      };
    },

    stats: null,
    setStats: function (stats: DevtoolState['stats']) {
      this.stats = stats;
    },

    selectedNode: null,
    setSelectedNode: function (selectedNode: DevtoolState['selectedNode']) {
      this.selectedNode = selectedNode;
    },

    activeProps: [],
    setActiveProps: function (activeProps: DevtoolState['activeProps']) {
      this.activeProps = activeProps;
    },

    overlayPickerEnabled: false,
    setOverlayPickerEnabled: function (enabled: DevtoolState['overlayPickerEnabled']) {
      this.overlayPickerEnabled = enabled;
    },

    overlayHighlightEnabled: true,
    setOverlayHighlightEnabled: function (enabled: DevtoolState['overlayHighlightEnabled']) {
      this.overlayHighlightEnabled = enabled;
    },
  };

  public stats = new Stats(this);
  public tree = new Tree(this);
  public properties = new Properties(this);
  public overlay = new Overlay(this);
  // Private properties
  private _devtools: Devtools | undefined;
  private _app: Application | undefined;
  private _stage: Container | undefined;
  private _renderer: Renderer | undefined;
  private _canvas: HTMLCanvasElement | undefined;
  private _pixi: typeof import('pixi.js') | undefined;
  private _version: string | undefined;

  private _updateThrottle = new Throttle();

  private _initialized = false;

  /**
   * Searches for a property in the window and its frames.
   * @param props - The properties to search for.
   * @returns The found property or undefined if not found.
   */
  public searchIFrames(props: (keyof Window)[]) {
    for (const prop of props) {
      if (window[prop]) {
        return window[prop];
      }
      if (window.frames) {
        for (let i = 0; i < window.frames.length; i += 1) {
          try {
            if (window.frames[i][prop]) {
              return window.frames[i][prop];
            }
          } catch (_) {
            // access to iframe was denied
          }
        }
      }
    }
    return undefined;
  }

  public get devtools() {
    if (this._devtools) return this._devtools;
    this._devtools = this.searchIFrames(['__PIXI_DEVTOOLS__']) as Devtools;

    if (!this._devtools) return undefined;

    const plugins = this._devtools.plugins || [];
    this._devtools.plugins = plugins;

    this._devtools.plugins.forEach((plugin) => {
      extensions.add(plugin);
    });

    return this._devtools;
  }

  /**
   * Gets the PixiJS Application.
   */
  public get app() {
    if (this._app) return this._app;

    this._app = this.devtools?.app;
    if (this._app) return this._app;

    this._app = this.searchIFrames(['__PIXI_APP__']) as Application;
    return this._app;
  }

  /**
   * Gets the PixiJS Stage.
   */
  public get stage() {
    if (this._stage) return this._stage;

    this._stage = this.devtools?.stage;
    if (this._stage) return this._stage;

    this._stage = this.searchIFrames(['__PIXI_STAGE__']) as Container;
    if (this._stage) return this._stage;

    this._stage = this.app?.stage;
    return this._stage;
  }

  /**
   * Gets the PixiJS Renderer.
   */
  public get renderer() {
    if (this._renderer) return this._renderer;
    this._renderer = this.devtools?.renderer;
    if (this._renderer) return this._renderer;

    this._renderer = this.searchIFrames(['__PIXI_RENDERER__']);
    if (this._renderer) return this._renderer;

    this._renderer = this.app?.renderer;
    return this._renderer;
  }

  /**
   * Gets the PixiJS Canvas.
   */
  public get canvas() {
    if (this._canvas) return this._canvas;

    const renderer = this.renderer!;
    const validKeys = ['canvas', 'view'] as const;

    // find the first valid key
    const key = validKeys.find((key) => renderer && key in renderer) as 'view' | 'canvas' | undefined;

    this._canvas = key ? (renderer[key] as HTMLCanvasElement) : undefined;

    return this._canvas;
  }

  /**
   * Gets the PixiJS library.
   */
  public get pixi() {
    if (this._pixi) return this._pixi;

    this._pixi = this.devtools?.pixi;
    if (this._pixi) return this._pixi;

    this._pixi = this.searchIFrames(['PIXI', '__PIXI__']) as typeof import('pixi.js');
    return this._pixi;
  }

  /**
   * Gets the PixiJS version.
   */
  public get version() {
    if (this._version) return this._version;
    this._version = this.pixi?.VERSION ?? '';
    return this._version;
  }

  public get majorVersion() {
    if (this.version === '') {
      // lets try and find the version
      const stage = this.stage;
      if (stage.effects != null && Array.isArray(stage.effects) && '_updateFlags' in stage) {
        return '8';
      }
      return '7';
    }
    return this.version.split('.')[0];
  }

  /**
   * Checks if PixiJS is active.
   * @returns A message indicating if PixiJS is active or not.
   */
  public get isPixiActive() {
    return this.app || (this.stage && this.renderer) ? DevtoolMessage.active : DevtoolMessage.inactive;
  }

  public reset() {
    this._devtools = undefined;
    this._app = undefined;
    this._stage = undefined;
    this._renderer = undefined;
    this._canvas = undefined;
    this._pixi = undefined;
    this._version = undefined;
    this._initialized = false;
  }

  public update() {
    if (!this._initialized) {
      this.init();
    }

    // TODO: tree: 300ms, stats: 300ms, properties: 300ms, overlay: 50ms

    this.overlay.update();
    if (this._updateThrottle.shouldExecute(this.settings.throttle)) {
      this.preupdate();

      // check if we are accessing the correct stage
      if (this.renderer!.lastObjectRendered === this.stage) {
        // loop the scene graph
        loop({
          container: this.stage!,
          loop: (container) => {
            this.stats.update(container);
            this.tree.update(container);
          },
          test: (container) => {
            if (container.__devtoolIgnore) return false;
            if (container.__devtoolIgnoreChildren) return 'children';
            return true;
          },
        });
      }

      this.postupdate();
    }
  }

  private init() {
    this.overlay.init();
    this.properties.init();
    this.stats.init();
    this.tree.init();
    this._initialized = true;
  }

  private preupdate() {
    // reset the state before updating
    this.state.setSceneGraph(null);
    this.state.setStats({});
    // TODO: probably don't need to reset this every time
    this.state.setSelectedNode(null);
    this.state.setActiveProps([]);
    this.state.setVersion(this.version === '' ? `>${this.majorVersion}.0.0` : this.version);

    this.stats.preupdate();
    this.tree.preupdate();
  }

  private postupdate() {
    this.stats.complete();
    this.tree.complete();
    this.properties.update();
    this.properties.complete();
    this.overlay.complete();

    try {
      // post the state to the devtools
      window.postMessage({ method: DevtoolMessage.stateUpdate, data: JSON.stringify(this.state) }, '*');
    } catch (error) {
      throw new Error(`[PixiJS Devtools] Error posting state update: ${(error as Error).message}`);
    }
  }
}

extensions.add(overlayExtension);
extensions.add(totalStatsExtension, pixiStatsExtension);
extensions.add(
  containerPropertyExtension,
  viewPropertyExtension,
  textPropertyExtension,
  nineSlicePropertyExtension,
  tilingSpritePropertyExtension,
  animatedSpritePropertyExtension,
);

// Export an instance of PixiWrapper
export const PixiDevtools = new PixiWrapper();
window.__PIXI_DEVTOOLS_WRAPPER__ = PixiDevtools;
