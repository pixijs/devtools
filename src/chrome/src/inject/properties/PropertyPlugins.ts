import { Container } from 'pixi.js';
import { AnimatedSpritePropsPlugin } from './AnimatedSpritePropsPlugin';
import { ContainerPropsPlugin } from './ContainerPropsPlugin';
import { GraphicsPropsPlugin } from './GraphicsPropsPlugin';
import { MeshPropsPlugin } from './MeshPropsPlugin';
import { NineSliceSpritePropsPlugin } from './NineSlicePropsPlugin';
import { SpritePropsPlugin } from './SpritePropsPlugin';
import { TextPropsPlugin } from './TextPropsPlugin';
import { TilingSpritePropsPlugin } from './TilingSpritePropsPlugin';
import { PropertyPlugin } from './propertyTypes';

export class PropertyPluginsClass {
  public defaultPlugins: PropertyPlugin<any>[] = [
    ContainerPropsPlugin,
    SpritePropsPlugin,
    GraphicsPropsPlugin,
    MeshPropsPlugin,
    TextPropsPlugin,
    NineSliceSpritePropsPlugin,
    TilingSpritePropsPlugin,
    AnimatedSpritePropsPlugin,
  ];

  public getCurrentValues(node: Container, panels: { keys: string[]; values: any }, out: Record<string, any>) {
    this._getCurrentValues(this.defaultPlugins, node, panels, out);
    this._getCurrentValues(this._getUserPlugins(), node, panels, out);
  }

  private _getCurrentValues(
    plugins: PropertyPlugin<any>[],
    node: Container,
    panels: { keys: string[]; values: any },
    values: Record<string, any>,
  ) {
    plugins.forEach((plugin) => {
      panels.keys.forEach((key) => {
        const value = plugin.getPropValue(node, key);

        if (!value) return;

        values[value.prop] = value.value;
      });
    });
  }

  public setValue(node: Container, property: string, value: any) {
    this._setValue(this.defaultPlugins, node, property, value);
    this._setValue(this._getUserPlugins(), node, property, value);
  }

  private _setValue(plugins: PropertyPlugin<any>[], node: Container, property: string, value: any) {
    plugins.forEach((plugin) => {
      plugin.setPropValue(node, property, value);
    });
  }

  public createPropertyList(allPropertyKeys: Record<string, any>, node: Container) {
    this._createPropertyList(this.defaultPlugins, allPropertyKeys, node);
    this._createPropertyList(this._getUserPlugins(), allPropertyKeys, node);
  }

  private _createPropertyList(plugins: PropertyPlugin<any>[], allPropertyKeys: Record<string, any>, node: Container) {
    plugins.forEach((plugin) => {
      const pluginValues = plugin.getValidProps(node);

      pluginValues.forEach((key) => {
        allPropertyKeys[key.property] = key;
      });
    });
  }

  private _getUserPlugins() {
    return window.__PIXI__DEVTOOLS__?.scenePanel?.propertyPlugins || [];
  }
}

export const PropertyPlugins = new PropertyPluginsClass();
