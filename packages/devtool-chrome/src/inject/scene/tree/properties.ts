import type { PropertyPlugin } from '@pixi/devtools';
import { ContainerPropertiesPlugin } from './plugins/ContainerProperties';
import { PixiDevtools } from '../../pixi';
import type { PropertyPanelData } from '@devtool/frontend/pages/scene/scene-tree/Properties';
import { SpritePropertiesPlugin } from './plugins/SpriteProperties';

export class Properties {
  public defaultPlugins: PropertyPlugin[] = [
    ContainerPropertiesPlugin,
    SpritePropertiesPlugin,
    // GraphicsPropertiesPlugin,
    // MeshPropertiesPlugin,
    // TextPropertiesPlugin,
    // NineSliceSpritePropertiesPlugin,
    // TilingSpritePropertiesPlugin,
    // AnimatedSpritePropertiesPlugin,
  ];

  private _plugins!: PropertyPlugin[];

  public init() {
    this._plugins = [...(PixiDevtools.devtools.plugins?.properties ?? []), ...this.defaultPlugins];
    // this._plugins.forEach((plugin) => {
    //   plugin.props.forEach((prop) => {
    //     prop.value = null;
    //   });
    // });
  }

  public setValue(prop: string, value: any) {
    const selectedNode = PixiDevtools.tree.selectedNode;

    if (!selectedNode) return;

    this._plugins.forEach((plugin) => {
      plugin.setValue(selectedNode, prop, value);
    });
  }

  public update() {
    const selectedNode = PixiDevtools.tree.selectedNode;
    if (!selectedNode) return;

    this._plugins.forEach((plugin) => {
      plugin.updateProps(PixiDevtools.tree.selectedNode!);
    });
  }

  public complete() {
    const activeProps = this._plugins.map((plugin) => plugin.props).flat();
    PixiDevtools.state.activeProps = activeProps as PropertyPanelData[];
  }
}
