import type { Container } from 'pixi.js';
import type { PixiDevtools } from './pixi';

export class PixiHandler {
  protected _devtool: typeof PixiDevtools;
  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public init() {}
  public reset() {}
  public preupdate() {}
  public update() {}
  public throttledUpdate() {}
  public loop(_container: Container) {}
  public postupdate() {}
}
