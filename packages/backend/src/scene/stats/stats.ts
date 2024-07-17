import type { StatsExtension } from '@pixi/devtools';
import type { PixiDevtools } from '../../pixi';
import type { Container } from 'pixi.js';
import { getExtensionsProp } from '../../extensions/getExtension';
import { extensions } from '../../extensions/Extensions';

export class Stats {
  public static extensions: StatsExtension[] = [];
  private _extensions: Required<StatsExtension>[] = [];
  private _devtool: typeof PixiDevtools;

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public init() {
    this._extensions = getExtensionsProp(Stats.extensions, 'track');
    const allKeys: string[] = [];
    for (const plugin of this._extensions) {
      allKeys.push(...plugin.getKeys());
    }

    // check for duplicates
    const duplicates = allKeys.filter((item, index) => allKeys.indexOf(item) !== index);

    if (duplicates.length > 0) {
      console.warn(`[PixiJS Devtools] Stats: Duplicate keys found: ${duplicates.join(', ')}`);
    }
  }

  public preupdate() {}

  public update(container: Container) {
    const state = this._devtool.state.stats!;
    for (const plugin of this._extensions) {
      plugin.track(container, state);
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

extensions.handleByList('stats', Stats.extensions);
