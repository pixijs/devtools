import type { Container } from 'pixi.js';
import type { PixiDevtools } from '../../pixi';
import type { SceneGraphEntry } from '@devtool/frontend/types';
import type { PixiNodeType, TreeExtension } from '@pixi/devtools';
import { getPixiType } from '../../utils/getPixiType';
import { extensions } from '../../extensions/Extensions';
import { getExtensionsProp } from '../../extensions/getExtension';

const uidMap = new WeakMap<Container, string>();
let uid = 0;
export class Tree {
  public static extensions: TreeExtension[] = [];
  private _sceneGraph: Map<Container, SceneGraphEntry> = new Map();
  private _idMap: Map<string, Container> = new Map();
  public selectedNode: Container | null = null;

  private _devtool: typeof PixiDevtools;
  private _metadataExtensions: Required<TreeExtension>[] = [];
  private _onButtonPressExtensions: Required<TreeExtension>[] = [];
  private _onContextMenuExtensions: Required<TreeExtension>[] = [];
  private _onRenameExtensions: Required<TreeExtension>[] = [];
  private _onDeletedExtensions: Required<TreeExtension>[] = [];
  private _onSwapExtensions: Required<TreeExtension>[] = [];
  private _onSelectedExtensions: Required<TreeExtension>[] = [];
  private _treePanelButtons: Required<TreeExtension>[] = [];

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public init() {
    this._metadataExtensions = getExtensionsProp(Tree.extensions, 'updateNodeMetadata');
    this._onButtonPressExtensions = getExtensionsProp(Tree.extensions, 'onButtonPress');
    this._onContextMenuExtensions = getExtensionsProp(Tree.extensions, 'onContextMenu');
    this._onRenameExtensions = getExtensionsProp(Tree.extensions, 'onRename');
    this._onDeletedExtensions = getExtensionsProp(Tree.extensions, 'onDeleted');
    this._onSwapExtensions = getExtensionsProp(Tree.extensions, 'onSwap');
    this._onSelectedExtensions = getExtensionsProp(Tree.extensions, 'onSelected');
    this._treePanelButtons = getExtensionsProp(Tree.extensions, 'panelButtons');
  }

  public nodeButtonPress(nodeId: string, buttonAction: string, value?: boolean) {
    const node = this._idMap.get(nodeId);

    if (!node) return;

    this._onButtonPressExtensions.forEach((ext) => {
      ext.onButtonPress(node, buttonAction, value);
    });
  }

  public treePanelButtonPress(buttonAction: string) {
    this._onButtonPressExtensions.forEach((ext) => {
      ext.onButtonPress(this._devtool.stage, buttonAction);
    });
  }

  public nodeContextMenu(nodeId: string, contextMenuAction: string) {
    const node = this._idMap.get(nodeId);

    if (!node) return;

    this._onContextMenuExtensions.forEach((ext) => {
      ext.onContextMenu(node, contextMenuAction);
    });
  }

  public setSelected(nodeId: string | null) {
    if (nodeId == null) {
      this.selectedNode = null;
      return;
    }
    this.selectedNode = this._idMap.get(nodeId) ?? null;
    window.$pixi = this.selectedNode;
    this._onSelectedExtensions.forEach((ext) => {
      ext.onSelected(this.selectedNode!);
    });
  }

  public setSelectedFromNode(node: Container) {
    this.selectedNode = node;
    window.$pixi = node;
    this._onSelectedExtensions.forEach((ext) => {
      ext.onSelected(node);
    });
  }

  public moveNode(nodeId: string, parentId: string, index: number) {
    const node = this._idMap.get(nodeId);
    const parent = this._idMap.get(parentId);

    if (!node || !parent) return;

    node.parent?.removeChild(node);
    parent.addChildAt(node, index);

    this._onSwapExtensions.forEach((ext) => {
      ext.onSwap(node, index);
    });
  }

  public renameNode(nodeId: string, name: string) {
    const sceneNode = this._idMap.get(nodeId);

    if (!sceneNode) return;

    if (this._devtool.majorVersion === '8') {
      sceneNode.label = name;
    } else {
      sceneNode.name = name;
    }

    this._onRenameExtensions.forEach((ext) => {
      ext.onRename(sceneNode, name);
    });
  }

  public deleteNode(nodeId: string) {
    const sceneNode = this._idMap.get(nodeId);

    if (!sceneNode) return;
    sceneNode.parent?.removeChild(sceneNode);

    this._onDeletedExtensions.forEach((ext) => {
      ext.onDeleted(sceneNode);
    });
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

    this._treePanelButtons.forEach((ext) => {
      this._devtool.state.sceneTreeData!.buttons.push(...ext.panelButtons);
    });
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

    this._metadataExtensions.forEach((ext) => {
      ext.updateNodeMetadata(container, node.metadata);
    });

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

extensions.handleByList('sceneTree', Tree.extensions);
