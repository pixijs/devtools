import type { Container } from 'pixi.js';
import type { PixiDevtools } from '../../pixi';
import { SceneGraphEntry, PixiNodeType } from '@devtool/frontend/types';
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
  }

  public init() {
    this._sceneGraph.clear();
    this._idMap.clear();
  }

  public complete() {
    this._devtool.state.selectedNode = this.selectedNode
      ? (this._sceneGraph.get(this.selectedNode)!.id as string)
      : null;
  }

  public update(container: Container) {
    const stage = this._devtool.stage;
    const type = getPixiType(container);

    const node = {
      id: this._getId(container),
      name: this._getName(container, type),
      children: [],
      metadata: {
        type,
        uid: this._getId(container),
      },
    };

    this._idMap.set(node.id, container);

    if (container === stage) {
      const graph = this._devtool.state.sceneGraph;
      graph?.children.push(node);
      this._sceneGraph.set(container, node);
      return;
    }

    const parent = this._sceneGraph.get(container.parent);
    parent?.children.push(node);
    this._sceneGraph.set(container, node);
  }

  private _getName(container: Container, type: PixiNodeType) {
    const stage = this._devtool.stage;
    const name = container.label ?? container.name;
    const nameIsType = name === type;
    let finalName: string;

    if (nameIsType) {
      finalName = `${name}${stage === container ? ' (Stage)' : ''}`;
    } else {
      if (name) {
        finalName = `${name} (${stage === container ? 'Stage' : type})`;
      } else {
        finalName = `${type}${stage === container ? ' (Stage)' : ''}`;
      }
    }

    return finalName;
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
