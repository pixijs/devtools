import type { Container } from 'pixi.js';
import { PixiHandler } from '../handler';
import { Stats } from './stats/stats';
import type { PixiDevtools } from '../pixi';
import { Overlay } from './overlay/overlay';
import { Tree } from './tree/tree';
import { Properties } from './tree/properties';

export class Scene extends PixiHandler {
  public stats: Stats;
  public overlay: Overlay;
  public tree: Tree;
  public properties: Properties;

  // scene state
  // public get stats(){
  //   return this.stats.stats;
  // }

  constructor(devtool: typeof PixiDevtools) {
    super(devtool);
    this.stats = new Stats(devtool);
    this.overlay = new Overlay(devtool);
    this.tree = new Tree(devtool);
    this.properties = new Properties(devtool);
  }

  public override init() {
    this.stats.init();
    this.overlay.init();
    this.tree.init();
    this.properties.init();
  }
  public override reset() {
    this.stats.reset();
    this.overlay.reset();
    this.tree.reset();
    this.properties.reset();
  }
  public override preupdate() {
    this.stats.preupdate();
    this.overlay.preupdate();
    this.tree.preupdate();
    this.properties.preupdate();
  }
  public override loop(container: Container) {
    this.stats.loop(container);
    this.tree.loop(container);
  }
  public override postupdate() {
    this.stats.postupdate();
    this.overlay.postupdate();
    this.tree.postupdate();
    this.properties.postupdate();
  }

  public override throttledUpdate() {
    this.stats.throttledUpdate();
    this.overlay.throttledUpdate();
    this.tree.throttledUpdate();
    this.properties.throttledUpdate();
  }
  public override update() {
    this.stats.update();
    this.overlay.update();
    this.tree.update();
    this.properties.update();
  }

  public getStats() {
    return this.stats.stats;
  }
}
