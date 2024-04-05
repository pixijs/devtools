import type { PropertyPanelData } from '@devtool/frontend/pages/scene/scene-section/Properties';
import type { PropertyPlugin } from '@pixi/devtools';
import type { PixiDevtools } from '../../pixi';
import { AnimatedSpritePropertiesPlugin } from './plugins/AnimatedSpriteProperties';
import { ContainerPropertiesPlugin } from './plugins/ContainerProperties';
import { GraphicsPropertiesPlugin } from './plugins/GraphicsProperties';
import { MeshPropertiesPlugin } from './plugins/MeshProperties';
import { NineSliceSpritePropertiesPlugin } from './plugins/NineSliceProperties';
import { SpritePropertiesPlugin } from './plugins/SpriteProperties';
import { TextPropertiesPlugin } from './plugins/TextProperties';
import { TilingSpritePropertiesPlugin } from './plugins/TilingSpriteProperties';

export class Properties {
  public defaultPlugins: PropertyPlugin[] = [
    ContainerPropertiesPlugin,
    SpritePropertiesPlugin,
    GraphicsPropertiesPlugin,
    MeshPropertiesPlugin,
    TextPropertiesPlugin,
    NineSliceSpritePropertiesPlugin,
    TilingSpritePropertiesPlugin,
    AnimatedSpritePropertiesPlugin,
  ];

  private _plugins!: PropertyPlugin[];
  private _devtool: typeof PixiDevtools;

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public init() {
    this._plugins = [...(this._devtool.devtools!.plugins?.properties ?? []), ...this.defaultPlugins];
  }

  public setValue(prop: string, value: any) {
    const selectedNode = this._devtool.tree.selectedNode;

    if (!selectedNode) return;

    this._plugins.forEach((plugin) => {
      if (plugin.containsProperty(prop)) plugin.setValue(selectedNode, prop, value);
    });
  }

  public update() {
    const selectedNode = this._devtool.tree.selectedNode;
    if (!selectedNode) return;

    this._plugins.forEach((plugin) => {
      plugin.updateProps(this._devtool.tree.selectedNode!);
    });
  }

  public complete() {
    const activeProps = this._plugins.map((plugin) => plugin.props).flat();
    const uniqueProps = Array.from(new Set(activeProps.map(JSON.stringify as any))).map(JSON.parse as any);
    this._devtool.state.activeProps = uniqueProps as PropertyPanelData[];
  }
}
