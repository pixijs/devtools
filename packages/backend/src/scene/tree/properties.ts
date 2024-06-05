import type { PropertyPanelData } from '@devtool/frontend/components/properties/propertyTypes';
import type { PropertiesExtension } from '@pixi/devtools';
import { extensions } from '../../extensions/Extensions';
import type { PixiDevtools } from '../../pixi';

export class Properties {
  public static extensions: PropertiesExtension[] = [];

  private _plugins!: PropertiesExtension[];
  private _devtool: typeof PixiDevtools;

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public init() {
    this._plugins = Properties.extensions;
  }

  public setValue(prop: string, value: any) {
    const selectedNode = this._devtool.tree.selectedNode;

    if (!selectedNode) return;

    this._plugins.forEach((plugin) => {
      if (plugin.testNode(selectedNode) && plugin.testProp(prop)) {
        plugin.setProperty(selectedNode, prop, value);
      }
    });
  }

  public update() {
    const selectedNode = this._devtool.tree.selectedNode;
    if (!selectedNode) return;
  }

  public complete() {
    const selectedNode = this._devtool.tree.selectedNode;
    if (!selectedNode) return;

    const activeProps = this._plugins.reduce(
      (result, plugin) => {
        if (plugin.testNode(selectedNode)) {
          result.push(...plugin.getProperties(selectedNode));
        }
        return result;
      },
      [] as ReturnType<PropertiesExtension['properties']>,
    );
    this._devtool.state.activeProps = activeProps as PropertyPanelData[];
  }
}

extensions.handleByList('sceneProperties', Properties.extensions);
