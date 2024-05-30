import { DevtoolState } from '@devtool/frontend/types';
import type { Container } from 'pixi.js';
import type { PixiDevtools } from '../../pixi';
import { getPixiType } from '../../utils/getPixiType';
import type { NodeTrackerPlugin } from '@pixi/devtools';

const totalNodesPlugin: NodeTrackerPlugin = {
  trackNode: (_container: Container, state: NonNullable<DevtoolState['stats']>) => {
    state.total += 1;
    return false;
  },
  getKeys: () => {
    return ['total'];
  },
};

const defaultPlugin: NodeTrackerPlugin = {
  trackNode: (container: Container, state: NonNullable<DevtoolState['stats']>) => {
    const type = getPixiType(container);

    if (type === 'BitmapText') {
      state.bitmapText += 1;
    } else if (type === 'HTMLText') {
      state.htmlText += 1;
    } else if (type === 'Text') {
      state.text += 1;
    } else if (type === 'Mesh') {
      state.mesh += 1;
    } else if (type === 'Graphics') {
      state.graphics += 1;
    } else if (type === 'Sprite') {
      state.sprite += 1;
    } else if (type === 'Container') {
      state.container += 1;
    }

    return true;
  },
  getKeys: () => {
    return ['container', 'sprite', 'graphics', 'mesh', 'text', 'bitmapText', 'htmlText'];
  },
};

export class NodeTracker {
  private _devtool: typeof PixiDevtools;
  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  private get plugins() {
    return [totalNodesPlugin, ...(this._devtool.devtools?.plugins?.stats ?? []), defaultPlugin];
  }
  public init() {
    // loop through all plugins and get the keys and set to 0
    const state = this._devtool.state.stats!;
    for (const plugin of this.plugins) {
      for (const key of plugin.getKeys()) {
        if (state[key] != undefined) {
          console.warn(`[PixiJS Devtools] NodeTrackerPlugin: Key ${key} already exists. This key will be overwritten.`);
        }
        state[key] = 0;
      }
    }
  }
  public trackNode(container: Container) {
    const state = this._devtool.state.stats!;
    for (const plugin of this.plugins) {
      if (plugin.trackNode(container, state)) {
        break;
      }
    }
  }
  public complete() {
    // remove any nodes that are at 0
    const state = this._devtool.state.stats!;

    for (const key in state) {
      if (state[key] === 0) {
        delete state[key];
      }

      // also format the keys to be more readable
      const formattedKey = this.formatCamelCase(key);
      state[formattedKey] = state[key];
      delete state[key];
    }
  }

  private formatCamelCase(string: string) {
    let result = string.replace(/([A-Z])/g, ' $1');
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }
}
