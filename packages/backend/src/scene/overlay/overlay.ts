import type { Container } from 'pixi.js';
import type { PixiDevtools } from '../../pixi';
import { loop } from '../../utils/loop';
import type { OverlayExtension } from '@pixi/devtools';
import { getExtensionProp } from '../../extensions/getExtension';
import { extensions } from '../../extensions/Extensions';
import { PixiHandler } from '../../handler';
import { DevtoolMessage } from '@devtool/frontend/types';

export class Overlay extends PixiHandler {
  static extensions: OverlayExtension[] = [];
  private _canvas!: HTMLCanvasElement;
  private _overlay!: HTMLDivElement;
  private _selectedHighlight!: HTMLDivElement;
  private _hoverHighlight!: HTMLDivElement;
  private _pickerEnabled = false;
  private _highlightEnabled = false;
  private _hoveredNode: Container | null = null;

  // cache the extension for bounds as this happens on every frame
  private _boundsExt!: Required<OverlayExtension>;

  private _selectedStylesExt!: Required<OverlayExtension>;
  private _hoverStylesExt!: Required<OverlayExtension>;

  private _keydown = false;

  constructor(devtool: typeof PixiDevtools) {
    super(devtool);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        window.postMessage({ method: DevtoolMessage.overlayStateUpdate, data: { overlayPickerEnabled: true } }, '*');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) {
        window.postMessage({ method: DevtoolMessage.overlayStateUpdate, data: { overlayPickerEnabled: false } }, '*');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  public override init() {
    this._boundsExt = getExtensionProp(Overlay.extensions, 'getGlobalBounds');

    const newCanvas = this._devtool.canvas!;

    this._highlightEnabled = false;
    this._pickerEnabled = false;

    if (newCanvas === this._canvas) {
      return;
    }

    this._canvas = newCanvas;
    this._buildOverlay();
    this._selectedStylesExt = getExtensionProp(Overlay.extensions, 'getSelectedStyle');
    this._hoverStylesExt = getExtensionProp(Overlay.extensions, 'getHoverStyle');
    this._buildHighlight('_selectedHighlight', {});
    this._buildHighlight('_hoverHighlight', {});
  }

  public override update() {
    this._updateOverlay();
    this.enableHighlight(this._highlightEnabled);
  }

  public enablePicker(value: boolean) {
    this._pickerEnabled = this._keydown ? true : value;

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

    const selectedNode = this._devtool.scene.tree.selectedNode;

    if (!selectedNode || !this._highlightEnabled) {
      this.disableHighlight('_selectedHighlight');
    } else {
      this.activateHighlight('_selectedHighlight', selectedNode);
      this._updateHighlight(
        '_selectedHighlight',
        this._selectedStylesExt.getSelectedStyle(this._devtool.scene.tree.selectedNode),
      );
    }

    if (!this._hoveredNode || !this._highlightEnabled || this._hoveredNode === selectedNode) {
      this.disableHighlight('_hoverHighlight');
    } else {
      this.activateHighlight('_hoverHighlight', this._hoveredNode!);
      this._updateHighlight('_hoverHighlight', this._hoverStylesExt.getHoverStyle(this._hoveredNode));
    }
  }

  private activateHighlight(type: '_selectedHighlight' | '_hoverHighlight', node: Container) {
    const bounds = this._boundsExt.getGlobalBounds(node);
    Object.assign(this[type].style, {
      transform: `translate(${bounds.x}px, ${bounds.y}px)`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
    });
  }

  private disableHighlight(type: '_selectedHighlight' | '_hoverHighlight') {
    if (!this[type]) {
      return;
    }
    this[type].style.transform = 'scale(0)';
  }

  public highlight(id: string) {
    const node = this._devtool.scene.tree['_idMap'].get(id);

    if (node === this._devtool.scene.tree.selectedNode) {
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

  private _buildHighlight(type: '_selectedHighlight' | '_hoverHighlight', styles: Partial<CSSStyleDeclaration>) {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '0',
      height: '0',
      pointerEvents: 'none',
      transformOrigin: 'top left',
      ...styles,
    });
    this._overlay.appendChild(box);
    this[type] = box;
  }

  private _updateHighlight(type: '_selectedHighlight' | '_hoverHighlight', styles: Partial<CSSStyleDeclaration>) {
    Object.assign(this[type].style, styles);
  }

  private _updateOverlay() {
    const canvas = this._devtool.canvas!;
    const renderer = this._devtool.renderer!;
    const version = this._devtool.majorVersion;

    const res = version === '8' ? 1 : renderer.resolution;

    Object.assign(this._overlay!.style, {
      width: `${renderer.width / res}px`,
      height: `${renderer.height / res}px`,
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
      this._devtool.scene.tree.setSelectedFromNode(hit);
      this.enablePicker(false);
    }
  }
}

extensions.handleByList('overlay', Overlay.extensions);
