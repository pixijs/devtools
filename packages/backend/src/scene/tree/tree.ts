import type { SceneGraphEntry } from '@devtool/frontend/types';
import type { PixiNodeType, TreeExtension } from '@pixi/devtools';
import type { Container } from 'pixi.js';
import { extensions } from '../../extensions/Extensions';
import { getExtensionsProp } from '../../extensions/getExtension';
import { PixiHandler } from '../../handler';
import { getPixiType } from '../../utils/getPixiType';
import { loop } from '../../utils/loop';

let uidMap = new WeakMap<Container, string>();
let uid = 0;
export class Tree extends PixiHandler {
  public static extensions: TreeExtension[] = [];
  private _sceneGraph: Map<Container, SceneGraphEntry> = new Map();
  private _stageNode: SceneGraphEntry | null = null;
  private _idMap: Map<string, Container> = new Map();
  public selectedNode: Container | null = null;

  private _metadataExtensions: Required<TreeExtension>[] = [];
  private _onButtonPressExtensions: Required<TreeExtension>[] = [];
  private _onContextMenuExtensions: Required<TreeExtension>[] = [];
  private _onRenameExtensions: Required<TreeExtension>[] = [];
  private _onDeletedExtensions: Required<TreeExtension>[] = [];
  private _onSwapExtensions: Required<TreeExtension>[] = [];
  private _onSelectedExtensions: Required<TreeExtension>[] = [];
  private _treePanelButtons: Required<TreeExtension>[] = [];

  public override init() {
    uidMap = new WeakMap();
    uid = 0;
    this._metadataExtensions = getExtensionsProp(Tree.extensions, 'updateNodeMetadata');
    this._onButtonPressExtensions = getExtensionsProp(Tree.extensions, 'onButtonPress');
    this._onContextMenuExtensions = getExtensionsProp(Tree.extensions, 'onContextButtonPress');
    this._onRenameExtensions = getExtensionsProp(Tree.extensions, 'onRename');
    this._onDeletedExtensions = getExtensionsProp(Tree.extensions, 'onDeleted');
    this._onSwapExtensions = getExtensionsProp(Tree.extensions, 'onSwap');
    this._onSelectedExtensions = getExtensionsProp(Tree.extensions, 'onSelected');
    this._treePanelButtons = getExtensionsProp(Tree.extensions, 'panelButtons');

    this.selectedNode = null;
    this._idMap.clear();
    this._sceneGraph.clear();
    this._stageNode = null;
  }

  public getSceneGraph() {
    if (!this._devtool.stage) return null;
    if (this._devtool.renderer!.lastObjectRendered !== this._devtool.stage) return null;

    this.clear();
    loop({
      container: this._devtool.stage,
      loop: (container) => {
        this.updateLoop(container);
      },
      test: (container) => {
        if (container.__devtoolIgnore) return false;
        if (container.__devtoolIgnoreChildren) return 'children';
        return true;
      },
    });

    // check if node has been removed, if so, clear selectedNode
    if (this.selectedNode && !this._sceneGraph.has(this.selectedNode)) {
      this.selectedNode = null;
      window.$pixi = null;
    }

    return {
      sceneGraph: this._stageNode,
      selectedNode: this.selectedNode ? (this._sceneGraph.get(this.selectedNode)!.id as string) : null,
      sceneTreeData: { buttons: this._treePanelButtons.map((ext) => ext.panelButtons).flat() },
    };
  }

  public getSelectedNode() {
    return this.selectedNode ? (this._sceneGraph.get(this.selectedNode)!.id as string) : null;
  }

  private clear() {
    this._sceneGraph.clear();
    this._idMap.clear();
    this._stageNode = null;
  }

  private updateLoop(container: Container, updateSceneGraph = true) {
    const stage = this._devtool.stage;
    const type = getPixiType(container);
    const { suffix, name } = this._getName(container);
    const node = {
      id: this._getId(container),
      name: name,
      children: [],
      metadata: {
        type,
        locked: container.__devtoolLocked,
        uid: this._getId(container),
        suffix,
        buttons: [],
        contextMenu: [],
      },
    } as SceneGraphEntry;

    this._metadataExtensions.forEach((ext) => {
      ext.updateNodeMetadata(container, node.metadata);
    });

    this._idMap.set(node.id, container);

    if (container === stage) {
      this._stageNode = node;
      this._sceneGraph.set(container, node);
      return;
    }

    if (updateSceneGraph) {
      const parent = this._sceneGraph.get(container.parent);
      parent?.children.push(node);
      this._sceneGraph.set(container, node);
    }
  }

  public nodeButtonPress(nodeId: string, buttonAction: string, value?: boolean) {
    const node = this._idMap.get(nodeId);

    if (!node) return;

    if (buttonAction === 'locked') {
      node.__devtoolLocked = value;
    }

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
      ext.onContextButtonPress(node, contextMenuAction);
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
    if (node.__devtoolLocked) return;

    node.parent?.removeChild(node);
    parent.addChildAt(node, index);

    this._onSwapExtensions.forEach((ext) => {
      ext.onSwap(node, index);
    });
  }

  public renameNode(nodeId: string, name: string) {
    const sceneNode = this._idMap.get(nodeId);

    if (!sceneNode) return;
    if (sceneNode.__devtoolLocked) return;

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
    if (sceneNode.__devtoolLocked) return;

    sceneNode.parent?.removeChild(sceneNode);

    this._onDeletedExtensions.forEach((ext) => {
      ext.onDeleted(sceneNode);
    });
  }

  private _getName(container: Container) {
    let type = container.constructor.name as PixiNodeType;

    if (type.startsWith('_')) {
      type = type.slice(1) as PixiNodeType;
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
