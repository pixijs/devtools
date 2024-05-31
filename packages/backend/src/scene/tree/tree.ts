import type { Container } from 'pixi.js';
import type { PixiDevtools } from '../../pixi';
import type { SceneGraphEntry, PixiNodeType } from '@devtool/frontend/types';
import { getPixiType } from '../../utils/getPixiType';

const uidMap = new WeakMap<Container, string>();
let uid = 0;
export class Tree {
  private _sceneGraph: Map<Container, SceneGraphEntry> = new Map();
  private _idMap: Map<string, Container> = new Map();
  public selectedNode: Container | null = null;

  private _devtool: typeof PixiDevtools;

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public setSelected(nodeId: string | null) {
    if (nodeId == null) {
      this.selectedNode = null;
      return;
    }
    this.selectedNode = this._idMap.get(nodeId) ?? null;
    window.$pixi = this.selectedNode;
  }

  public setSelectedFromNode(node: Container) {
    this.selectedNode = node;
    window.$pixi = node;
  }

  public moveNode(nodeId: string, parentId: string, index: number) {
    const node = this._idMap.get(nodeId);
    const parent = this._idMap.get(parentId);

    if (!node || !parent) return;

    node.parent?.removeChild(node);
    parent.addChildAt(node, index);
    console.log('moveNode', node, parent, index);
  }

  public renameNode(nodeId: string, name: string) {
    const sceneNode = this._idMap.get(nodeId);

    if (!sceneNode) return;

    if (sceneNode.name !== name) sceneNode.name = name;
  }

  public deleteNode(nodeId: string) {
    const sceneNode = this._idMap.get(nodeId);

    if (!sceneNode) return;
    sceneNode.parent?.removeChild(sceneNode);
  }

  public preupdate() {
    this._sceneGraph.clear();
    this._idMap.clear();
  }

  public complete() {
    // check if node has been removed, if so, clear selectedNode
    if (this.selectedNode && !this._sceneGraph.has(this.selectedNode)) {
      this.selectedNode = null;
      window.$pixi = null;
    }
    this._devtool.state.selectedNode = this.selectedNode
      ? (this._sceneGraph.get(this.selectedNode)!.id as string)
      : null;
  }

  public update(container: Container) {
    const stage = this._devtool.stage;
    const type = getPixiType(container);
    const { suffix, name } = this._getName(container, type);
    const node = {
      id: this._getId(container),
      name: name,
      children: [],
      metadata: {
        type,
        uid: this._getId(container),
        suffix,
      },
    };

    this._idMap.set(node.id, container);

    if (container === stage) {
      this._devtool.state.setSceneGraph(node);
      this._sceneGraph.set(container, node);
      return;
    }

    const parent = this._sceneGraph.get(container.parent);
    parent?.children.push(node);
    this._sceneGraph.set(container, node);
  }

  private _getName(container: Container, type: PixiNodeType) {
    if (type === 'Unknown') {
      type = container.constructor.name as PixiNodeType;
    }

    const stage = this._devtool.stage;
    const name = this._devtool.majorVersion === '8' ? container.label : container.name;
    const nameIsType = name === type;

    const nameStart = nameIsType || !name ? type : name;
    const suffix = name ? ` (${stage === container ? 'Stage' : type})` : stage === container ? ' (Stage)' : '';

    return { suffix, name: nameStart };
  }

  private _getId(container: Container) {
    const existing = uidMap.get(container);

    if (existing) {
      return existing;
    }

    const res = `${uid++}_${(Math.random() + 1).toString(36).substring(2)}`;
    uidMap.set(container, res);

    return res;
  }
}
