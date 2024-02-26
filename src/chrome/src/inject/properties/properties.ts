import { Container } from 'pixi.js';
import { getPixiWrapper } from '../devtool';
import { sceneGraphMap } from '../updateSceneGraph';
import { PropertyPlugins } from './PropertyPlugins';

export const properties = () => {
  let selectedNodeId: string | null = null;
  let selectNode: Container;
  const propertyPanel = {
    keys: [] as string[],
    values: [] as any[],
  };
  let currentValues = {} as Record<string, any>;
  return {
    idToNode: function () {
      if (!selectedNodeId) return;
      for (const [container, node] of sceneGraphMap.entries()) {
        if (node.metadata.uid === selectedNodeId) {
          selectNode = container;
          return { c: container, u: node.metadata.uid };
        }
      }
    },
    setSelectedNodeIds: function (nodes: string | null) {
      selectedNodeId = nodes;
      if (!nodes) {
        selectNode = null as any;
      }
    },
    updateSelectedNodes: function () {
      currentValues = {};
      const node = this.idToNode();
      const state = getPixiWrapper().state();

      if (!node) {
        this.setSelectedNodeIds(null);
        state.selectedNodeValues = {};
        state.selectedNodeProps = { values: [], keys: [] };
        state.selectedNodeId = null;
        return;
      }

      this.setProperties();

      PropertyPlugins.getCurrentValues(node.c, propertyPanel, currentValues);

      state.selectedNodeValues = currentValues;
      state.selectedNodeId = node.u;
      state.selectedNodeProps = propertyPanel;
    },
    setProperties: function () {
      propertyPanel.keys = [];
      propertyPanel.values = [];
      const node = this.idToNode();

      // find all the common properties
      const allPropertyKeys = {} as Record<string, any>;

      PropertyPlugins.createPropertyList(allPropertyKeys, node!.c);

      propertyPanel.keys = Object.keys(allPropertyKeys);
      propertyPanel.values = Object.values(allPropertyKeys);
    },
    setValue: function (property: string, value: any) {
      const node = this.idToNode();
      const state = getPixiWrapper().state();

      if (!node) {
        this.setSelectedNodeIds(null);
        state.selectedNodeValues = {};
        state.selectedNodeProps = { values: [], keys: [] };
        state.selectedNodeId = null;
        return;
      }

      PropertyPlugins.setValue(node.c, property, value);

      // now need to update the state
      this.updateSelectedNodes();
    },
    getSelectedNode: function () {
      return selectNode;
    },
  };
};
