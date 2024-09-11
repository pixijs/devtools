import type { StatsExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';
import { extensions } from '../../extensions/Extensions';
import { getExtensionsProp } from '../../extensions/getExtension';
import { PixiHandler } from '../../handler';

export class Stats extends PixiHandler {
  public static extensions: StatsExtension[] = [];
  private _extensions: Required<StatsExtension>[] = [];

  public stats: Record<string, number> = {};

  public override init() {
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

  public override reset() {
    this.stats = {};
  }

  public override throttledUpdate(): void {
    this.stats = {};
  }

  public override loop(container: Container) {
    for (const plugin of this._extensions) {
      plugin.track(container, this.stats);
    }
  }

  public override postupdate() {
    for (const key in this.stats) {
      // also format the keys to be more readable
      const formattedKey = this.formatCamelCase(key);
      this.stats[formattedKey] = this.stats[key];
      delete this.stats[key];
    }
  }

  private formatCamelCase(string: string) {
    let result = string.replace(/([A-Z])/g, ' $1');
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }
}

extensions.handleByList('stats', Stats.extensions);
