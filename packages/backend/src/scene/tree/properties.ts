import type { PropertiesExtension } from '@pixi/devtools';
import { extensions } from '../../extensions/Extensions';
import { PixiHandler } from '../../handler';

export class Properties extends PixiHandler {
  public static extensions: PropertiesExtension[] = [];

  private _extensions!: PropertiesExtension[];

  public override init() {
    this._extensions = Properties.extensions;
  }

  public setValue(prop: string, value: any) {
    const selectedNode = this._devtool.scene.tree.selectedNode;

    if (!selectedNode) return;

    this._extensions.forEach((plugin) => {
      if (plugin.testNode(selectedNode) && plugin.testProp(prop)) {
        plugin.setProperty(selectedNode, prop, value);
      }
    });
  }

  public getActiveProps() {
    const selectedNode = this._devtool.scene.tree.selectedNode;
    if (!selectedNode) return;

    if (selectedNode.__devtoolLocked) return;

    const activeProps = this._extensions.reduce(
      (result, plugin) => {
        if (plugin.testNode(selectedNode)) {
          result.push(...plugin.getProperties(selectedNode));
        }
        return result;
      },
      [] as ReturnType<PropertiesExtension['getProperties']>,
    );

    return activeProps || [];
  }
}

extensions.handleByList('sceneProperties', Properties.extensions);
