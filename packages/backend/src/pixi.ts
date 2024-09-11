import type { GlobalDevtoolState } from '@devtool/frontend/types';
import { DevtoolMessage } from '@devtool/frontend/types';
import type { Devtools } from '@pixi/devtools';
import type { Application, Container, Renderer, WebGLRenderer } from 'pixi.js';
import { Textures } from './assets/gpuTextures/textures';
import { extensions } from './extensions/Extensions';
import { Rendering } from './rendering/rendering';
import { overlayExtension } from './scene/overlay/overlayExtension';
import { Scene } from './scene/scene';
import { pixiStatsExtension, totalStatsExtension } from './scene/stats/statsExtension';
import { animatedSpritePropertyExtension } from './scene/tree/extensions/animatedSprite/animatedSpritePropertyExtension';
import { containerPropertyExtension } from './scene/tree/extensions/container/containerPropertyExtension';
import { nineSlicePropertyExtension } from './scene/tree/extensions/ninesliceSprite/ninesliceSpritePropertyExtension';
import { textPropertyExtension } from './scene/tree/extensions/text/textPropertyExtension';
import { tilingSpritePropertyExtension } from './scene/tree/extensions/tilingSprite/tilingSpritePropertyExtension';
import { viewPropertyExtension } from './scene/tree/extensions/view/viewPropertyExtension';
import { loop } from './utils/loop';
import { Throttle } from './utils/throttle';

/**
 * PixiWrapper is a class that wraps around the PixiJS library.
 * It provides access to the main PixiJS objects such as the Application, Stage, Renderer, Canvas, and the PixiJS library itself.
 * It also provides a method to search for these objects in the window and its frames.
 */
class PixiWrapper {
  public settings = {
    throttle: 100,
  };
  public state: Omit<GlobalDevtoolState, 'active' | 'setActive'> = {
    version: null,
    setVersion: function (version: GlobalDevtoolState['version']) {
      this.version = version;
    },
  };

  public textures = new Textures(this);
  public rendering = new Rendering(this);
  public scene = new Scene(this);
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
  private _originalRenderFn: Renderer['render'] | undefined;

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

    const exts = this._devtools.extensions || [];
    this._devtools.extensions = exts;

    this._devtools.extensions.forEach((plugin) => {
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
    if (this._stage) return this._stage;

    this._stage = this.renderer?.lastObjectRendered as Container;
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

  /**
   * Gets the major version of PixiJS.
   */
  public get majorVersion() {
    if (this.version === '') {
      if (!this.stage) {
        return null;
      }

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

  /**
   * Gets the type of renderer being used.
   */
  public get rendererType(): 'webgl' | 'webgl2' | 'webgpu' | null {
    if (!this.renderer) return null;
    return this.renderer.type === 0b10
      ? 'webgpu'
      : (this.renderer as WebGLRenderer).context.webGLVersion === 1
        ? 'webgl'
        : 'webgl2';
  }

  /**
   * Inject into the renderers render method.
   */
  public inject() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    if (this.renderer && !this.renderer.__devtoolInjected) {
      this.renderer.__devtoolInjected = true;
      // store the original render method
      this._originalRenderFn = this.renderer.render;
      this.renderer.render = new Proxy(this.renderer.render, {
        apply(target, thisArg, ...args) {
          that.update();
          // @ts-expect-error - TODO: fix this type
          return target.apply(thisArg, ...args);
        },
      });
      window.postMessage({ method: DevtoolMessage.active, data: {} }, '*');
    }
  }

  public reset() {
    this.renderer && this._originalRenderFn && (this.renderer.render = this._originalRenderFn);
    this.renderer && (this.renderer.__devtoolInjected = false);
    this.rendering.reset();
    this.scene.reset();
    this.textures.reset();
    this._resetState();
    this._devtools = undefined;
    this._app = undefined;
    this._stage = undefined;
    this._renderer = undefined;
    this._canvas = undefined;
    this._pixi = undefined;
    this._version = undefined;
    this._initialized = false;
    window.postMessage({ method: DevtoolMessage.pulse, data: {} }, '*');
  }

  public update() {
    if (!this._initialized) {
      this.init();
    }

    this.preupdate();
    this._update();
    if (this._updateThrottle.shouldExecute(this.settings.throttle)) {
      this.updatedThrottled();
      // check if we are accessing the correct stage
      if (this.renderer!.lastObjectRendered === this.stage) {
        // loop the scene graph
        loop({
          container: this.stage!,
          loop: (container) => {
            this.updateLoop(container);
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
    this.scene.init();
    this.textures.init();
    this.rendering.init();
    this._initialized = true;
  }

  private _resetState() {
    // TODO: this will cuase us to look through all the iframes each frame if version is not present, we need to add a flag
    this.state.setVersion(this.version === '' ? `>${this.majorVersion}.0.0` : this.version);
  }

  private preupdate() {
    this._resetState();
    this.scene.preupdate();
    this.textures.preupdate();
    this.rendering.preupdate();
  }

  private _update() {
    this.scene.update();
    this.textures.update();
    this.rendering.update();
  }

  private updatedThrottled() {
    this.scene.throttledUpdate();
    this.textures.throttledUpdate();
    this.rendering.throttledUpdate();
  }

  private updateLoop(container: Container) {
    this.scene.loop(container);
    this.textures.loop(container);
    this.rendering.loop(container);
  }

  private postupdate() {
    this.scene.postupdate();
    this.textures.postupdate();
    this.rendering.postupdate();

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
