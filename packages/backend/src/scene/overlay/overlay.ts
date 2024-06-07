import type { Container } from 'pixi.js';
import type { PixiDevtools } from '../../pixi';
import { loop } from '../../utils/loop';
import type { OverlayExtension } from '@pixi/devtools';
import { getExtensionProp } from '../../extensions/getExtension';
import { extensions } from '../../extensions/Extensions';

export class Overlay {
  static extensions: OverlayExtension[] = [];
  private _canvas!: HTMLCanvasElement;
  private _overlay!: HTMLDivElement;
  private _selectedHighlight!: HTMLDivElement;
  private _hoverHighlight!: HTMLDivElement;
  private _pickerEnabled = false;
  private _highlightEnabled = false;
  private _hoveredNode: Container | null = null;
  private _devtool: typeof PixiDevtools;

  // cache the extension for bounds as this happens on every frame
  private _boundsExt!: Required<OverlayExtension>;

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        this.enablePicker(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) {
        this.enablePicker(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  public init() {
    this._boundsExt = getExtensionProp(Overlay.extensions, 'getGlobalPosition');

    const newCanvas = this._devtool.canvas!;

    if (newCanvas === this._canvas) {
      return;
    }

    this._highlightEnabled = this._devtool.state.overlayHighlightEnabled;
    this._pickerEnabled = this._devtool.state.overlayPickerEnabled;

    this._canvas = newCanvas;
    this._buildOverlay();
    const selectedColor = getExtensionProp(Overlay.extensions, 'selectedColor').selectedColor;
    const hoverColor = getExtensionProp(Overlay.extensions, 'hoverColor').hoverColor;
    this._buildHighlight('_selectedHighlight', selectedColor);
    this._buildHighlight('_hoverHighlight', hoverColor);
  }

  public update() {
    this._updateOverlay();
    this.enableHighlight(this._highlightEnabled);
  }

  public complete() {
    this._devtool.state.overlayHighlightEnabled = this._highlightEnabled;
    this._devtool.state.overlayPickerEnabled = this._pickerEnabled;
  }

  public enablePicker(value: boolean) {
    this._pickerEnabled = value;

    if (this._pickerEnabled) {
      this.activatePick();
    } else {
      this.disablePick();
    }
  }

  public activatePick() {
    if (!this._overlay) return;
    this._overlay.style.pointerEvents = 'auto';
  }

  public disablePick() {
    if (!this._overlay) return;
    this._overlay.style.pointerEvents = 'none';
  }

  public enableHighlight(value: boolean) {
    this._highlightEnabled = value;

    const selectedNode = this._devtool.tree.selectedNode;

    if (!selectedNode || !this._highlightEnabled) {
      this.disableHighlight('_selectedHighlight');
    } else {
      this.activateHighlight('_selectedHighlight', selectedNode);
    }

    if (!this._hoveredNode || !this._highlightEnabled) {
      this.disableHighlight('_hoverHighlight');
    } else {
      this.activateHighlight('_hoverHighlight', this._hoveredNode!);
    }
  }

  public activateHighlight(type: '_selectedHighlight' | '_hoverHighlight', node: Container) {
    const { transform: wt, bounds } = this._boundsExt.getGlobalPosition(node);
    Object.assign(this[type].style, {
      transform: `matrix(${wt.a}, ${wt.b}, ${wt.c}, ${wt.d}, ${wt.tx}, ${wt.ty}) translate(${bounds.x}px, ${bounds.y}px)`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
    });
  }

  public disableHighlight(type: '_selectedHighlight' | '_hoverHighlight') {
    this[type].style.transform = 'scale(0)';
  }

  public highlight(id: string) {
    const node = this._devtool.tree['_idMap'].get(id);

    if (node === this._devtool.tree.selectedNode) {
      this._hoveredNode = null;
      this.disableHighlight('_hoverHighlight');
      return;
    }

    this._hoveredNode = node || null;
    if (!node) {
      this.disableHighlight('_hoverHighlight');
      return;
    }

    if (this._highlightEnabled) this.activateHighlight('_hoverHighlight', node);
  }

  private _buildOverlay() {
    this._overlay = document.createElement('div');
    Object.assign(this._overlay.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '0',
      height: '0',
      pointerEvents: 'none',
      transformOrigin: 'top left',
    });

    // find the top most element
    let parent: HTMLElement | null = this._canvas;
    while (parent) {
      parent = parent?.parentElement;
      if (parent?.tagName === 'BODY') {
        parent.appendChild(this._overlay);
        break;
      }
    }

    this._overlay.addEventListener('click', (e: MouseEvent) => {
      this._hitTest(e);
    });
  }

  private _buildHighlight(type: '_selectedHighlight' | '_hoverHighlight', color: string) {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '0',
      height: '0',
      pointerEvents: 'none',
      transformOrigin: 'top left',
      backgroundColor: color,
      border: '1px solid hsla(0, 0%, 100%, 0.5)',
    });
    this._overlay.appendChild(box);
    this[type] = box;
  }

  private _updateOverlay() {
    const canvas = this._devtool.canvas!;
    const renderer = this._devtool.renderer!;

    Object.assign(this._overlay!.style, {
      width: `${renderer.width / renderer.resolution}px`,
      height: `${renderer.height / renderer.resolution}px`,
    });
    const cBounds = canvas.getBoundingClientRect();
    this._overlay!.style.transform = '';
    const oBounds = this._overlay!.getBoundingClientRect();

    Object.assign(this._overlay!.style, {
      transform: `translate(${cBounds.x - oBounds.x}px, ${cBounds.y - oBounds.y}px) scale(${cBounds.width / oBounds.width}, ${cBounds.height / oBounds.height})`,
    });
  }

  private _hitTest(e: MouseEvent) {
    if (!this._pickerEnabled) return;
    const render = this._devtool.renderer!;

    // loop through the entire scene graph and set interactive to true
    // then hit test
    // then set it back to original value
    const originalInteractiveValues = new Map();
    loop({
      container: this._devtool.stage,
      loop: (node) => {
        // check if the node has an eventMode property, in earlier v7 versions it didn't exist
        originalInteractiveValues.set(node, node.eventMode === undefined ? node.interactive : node.eventMode);
        node.interactive = node.__devtoolLocked ? false : true;
      },
    });

    const point = { x: 0, y: 0 };
    render.events.mapPositionToPoint(point, e.clientX, e.clientY);
    const hit = render.events.rootBoundary.hitTest(point.x, point.y);

    // Set interactive back to its original value
    loop({
      container: this._devtool.stage,
      loop: (node) => {
        if (node.eventMode === undefined) {
          node.interactive = originalInteractiveValues.get(node);
        } else {
          node.eventMode = originalInteractiveValues.get(node);
        }
      },
    });

    if (hit) {
      this._devtool.tree.setSelectedFromNode(hit);
    }
  }
}

extensions.handleByList('overlay', Overlay.extensions);
