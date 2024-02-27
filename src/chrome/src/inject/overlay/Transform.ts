import { rotate, scale, styler } from 'free-transform';
import { Container } from 'pixi.js';
import { getPixiWrapper } from '../devtool';
import { getPixiObject } from './transform/utils/getPixiObject';

interface TransformOptions {
  classPrefix: string;
  node: Container;
  scaleLimit?: number;
  disableScale?: boolean;
  offsetX?: number;
  offsetY?: number;
  onUpdate?: (opts: any) => void;
}

export class Transform {
  classPrefix: string;
  node!: Container;
  width!: number;
  height!: number;
  x!: number;
  y!: number;
  scaleX!: number;
  scaleY!: number;
  scaleLimit!: number;
  angle!: number;
  disableScale!: boolean;
  offsetX!: number;
  offsetY!: number;
  onUpdate!: (...args: any[]) => void;

  transform!: HTMLElement;
  controls!: HTMLElement;
  content!: HTMLElement;
  scalePoints!: HTMLElement[];
  rotator!: HTMLDivElement;

  private _tempSize = { width: 0, height: 0 };

  constructor(options: Partial<TransformOptions>) {
    this.classPrefix = options.classPrefix || 'tr';
    this.injectStyles();
    this.handleRotation = this.handleRotation.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.handleTranslation = this.handleTranslation.bind(this);
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        --handle-size: 8px;
        --handle-offset: calc(var(--handle-size) / 2);
        --handle-color: #fff;
        --primary-color: rgb(191, 34, 87);
        --secondary-color: rgb(16, 153, 187);
      }
      .${this.classPrefix}-transform__rotator {
        top: -25px;
        border-radius: 50%;
        left: calc(50% - var(--handle-offset));
      }

      .${this.classPrefix}-transform__rotator,
      .${this.classPrefix}-transform__scale-point {
        background: #fff;
        width: var(--handle-size);
        height: var(--handle-size);
        position: absolute;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        border: 1px solid var(--primary-color);
        cursor: pointer;
      }
      .${this.classPrefix}-transform__rotator:hover,
      .${this.classPrefix}-transform__scale-point:hover {
        background: var(--secondary-color);
      }
      .${this.classPrefix}-transform__rotator:active,
      .${this.classPrefix}-transform__scale-point:active {
        background: var(--primary-color);
      }
      .${this.classPrefix}-transform__scale-point {
      }

      .${this.classPrefix}-transform__scale-point--tl {
        top: calc(var(--handle-offset) * -1);
        left: calc(var(--handle-offset) * -1);
      }

      .${this.classPrefix}-transform__scale-point--ml {
        top: calc(50% - var(--handle-offset));
        left: calc(var(--handle-offset) * -1);
      }

      .${this.classPrefix}-transform__scale-point--tr {
        left: calc(100% - var(--handle-offset));
        top: calc(var(--handle-offset) * -1);
      }

      .${this.classPrefix}-transform__scale-point--tm {
        left: calc(50% - var(--handle-offset));
        top: calc(var(--handle-offset) * -1);
      }

      .${this.classPrefix}-transform__scale-point--mr {
        left: calc(100% - var(--handle-offset));
        top: calc(50% - var(--handle-offset));
      }

      .${this.classPrefix}-transform__scale-point--bl {
        left: calc(var(--handle-offset) * -1);
        top: calc(100% - var(--handle-offset));
      }

      .${this.classPrefix}-transform__scale-point--bm {
        left: calc(50% - var(--handle-offset));
        top: calc(100% - var(--handle-offset));
      }

      .${this.classPrefix}-transform__scale-point--br {
        left: calc(100% - var(--handle-offset));
        top: calc(100% - var(--handle-offset));
      }
    `;
    document.head.appendChild(style);
  }

  dom() {
    if (this.transform) {
      return this.transform;
    }

    const dom = document.createElement('div');
    dom.className = `${this.classPrefix}-transform`;
    Object.assign(dom.style, {
      width: '100%',
      height: '100%',
    });

    const style = styler({
      x: this.x,
      y: this.y,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      width: this.width,
      height: this.height,
      angle: this.angle,
      disableScale: this.disableScale,
    });

    const content = document.createElement('div');
    content.className = `${this.classPrefix}-transform__content`;
    Object.assign(content.style, style.element);
    dom.appendChild(content);

    // create box inside content that has a background color
    const box = document.createElement('div');
    box.className = `${this.classPrefix}-transform__box`;
    content.appendChild(box);
    Object.assign(box.style, {
      width: `100%`,
      height: `100%`,
    });

    const controls = document.createElement('div');
    controls.className = `${this.classPrefix}-transform__controls`;
    controls.addEventListener('mousedown', this.handleTranslation);
    Object.assign(controls.style, { ...style.controls, border: '1px solid var(--primary-color)' });

    const scalePoints = ['tl', 'ml', 'tr', 'tm', 'mr', 'bl', 'bm', 'br'];
    const scalePointElements = [] as HTMLElement[];
    scalePoints.forEach((position) => {
      const scalePoint = document.createElement('div');
      scalePoint.className = `${this.classPrefix}-transform__scale-point ${this.classPrefix}-transform__scale-point--${position}`;
      scalePoint.addEventListener('mousedown', (event) => this.handleScale(position, event));
      scalePointElements.push(scalePoint);
      controls.appendChild(scalePoint);
    });

    const rotator = document.createElement('div');
    rotator.className = `${this.classPrefix}-transform__rotator`;
    rotator.addEventListener('mousedown', this.handleRotation);
    controls.appendChild(rotator);

    dom.appendChild(controls);

    this.transform = dom;
    this.controls = controls;
    this.content = content;
    this.scalePoints = scalePointElements;
    this.rotator = rotator;

    return dom;
  }

  update(options: TransformOptions) {
    this.node = options.node;
    
    const size = this.node.getBounds(false);
    // const Matrix = getPixiObject('Matrix');
    // const tempMatrix = new Matrix();
    // const gizmoMatrix = new Matrix();

    // const wt = this.node.parent?.worldTransform || this.node.worldTransform;
    // tempMatrix.append(wt.clone().invert());
    // tempMatrix.append(gizmoMatrix);

    this.x = this.node.worldTransform.tx;
    this.y = this.node.worldTransform.ty
    this.width = size.width;
    this.height = size.height;
    this._tempSize.width = this.width * this.node.worldTransform.a;
    this._tempSize.height = this.height * this.node.worldTransform.d;
    this.scaleX = this.node.worldTransform.a;
    this.scaleY = this.node.worldTransform.d;
    this.angle = this.node.angle;

    this.scaleLimit = options.scaleLimit || 0.1;
    this.disableScale = options.disableScale || false;
    this.offsetX = options.offsetX || 0;
    this.offsetY = options.offsetY || 0;
    this.onUpdate =
      options.onUpdate ||
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function (_opts: any) {
        /** */
      };

    this.updateStyle();
  }

  updateStyle() {
    const { element: elementStyle, controls: controlsStyles } = styler({
      x: this.x,
      y: this.y,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      width: this.width,
      height: this.height,
      angle: this.angle,
      disableScale: this.disableScale,
    });

    function convertNumbersToPx(styleObject: any) {
      for (const key in styleObject) {
        if (typeof styleObject[key] === 'number') {
          styleObject[key] = `${styleObject[key]}px`;
        }
      }
      return styleObject;
    }

    Object.assign(this.content.style, convertNumbersToPx(elementStyle));
    Object.assign(this.controls.style, convertNumbersToPx(controlsStyles));
  }

  updateNode() {
    const Matrix = getPixiObject('Matrix');
    const tempMatrix = new Matrix();
    const gizmoMatrix = new Matrix();

    // set gizmo transform from the transform matrix of the contents div
    const style = window.getComputedStyle(this.content, null);
    const trans = style.transform;
    const numberPattern = /-?\d+\.?\d*/g;
    const transform = trans!.match(numberPattern);
    const parsedTransform = transform!.map((n) => parseFloat(n));
    gizmoMatrix.set(...parsedTransform as [number, number, number, number, number, number]);



    const size = this.node.getLocalBounds();
    // undo the difference between the node's position and the gizmo's position
    // gizmoMatrix.translate(-size.x, -size.y)

    // tempMatrix.append(this.node.parent.worldTransform.clone().invert());
    // tempMatrix.append(gizmoMatrix);
    // this.node.setFromMatrix(tempMatrix);

    this.node.x = this.x;
    this.node.y = this.y;
    this.node.angle = this.angle;
    this.node.scale.set(this.scaleX, this.scaleY);


    // const pixiWrapper = getPixiWrapper();
    // const renderer = pixiWrapper.renderer()!;

    // // get the size of the node
    // const size = this.node.getBounds(false);

    // // convert the div's position to the canvas position
    // const point = { x: 0, y: 0 };
    // renderer.events.mapPositionToPoint(point, this.x, this.y);

    // // get the div's bounding rect which is the same as the canvas
    // const rect = this.transform.getBoundingClientRect();

    // // set the node's position
    // this.node.position.set(point.x + (this.node.x - size.x) + rect.left, point.y + (this.node.y - size.y) + rect.top);

    // set the container size
    // this.node.width = this._tempSize.width;
    // this.node.height = this._tempSize.height;

    // set rotation
    // this.node.angle = this.angle;
  }

  handleTranslation(event: MouseEvent) {
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;

    const drag = this.translate(
      {
        x: this.x,
        y: this.y,
        startX,
        startY,
      },
      (s) => {
        this.x = s.x;
        this.y = s.y;
        this.updateStyle();
        this.updateNode();
      },
    );

    const up = () => {
      this.transform!.removeEventListener('mousemove', drag);
      this.transform!.removeEventListener('mouseup', up);
    };

    this.transform!.addEventListener('mousemove', drag);
    this.transform!.addEventListener('mouseup', up);
  }

  handleScale(scaleType: string, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const drag = scale(
      scaleType,
      {
        startX: event.clientX,
        startY: event.clientY,
        x: this.x,
        y: this.y,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        width: this.width,
        height: this.height,
        angle: this.angle,
        scaleLimit: this.scaleLimit,
        scaleFromCenter: event.altKey,
        aspectRatio: event.shiftKey,
      },
      (s) => {
        this.x = s.x;
        this.y = s.y;
        this.scaleX = s.scaleX;
        this.scaleY = s.scaleY;
        this._tempSize.width = this.width * s.scaleX;
        this._tempSize.height = this.height * s.scaleY;
        this.updateStyle();
        this.updateNode();
      },
    );

    const up = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }

  handleRotation(event: MouseEvent) {
    event.stopPropagation();

    const drag = rotate(
      {
        startX: event.pageX,
        startY: event.pageY,
        x: this.x,
        y: this.y,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        width: this.width,
        height: this.height,
        angle: this.angle,
        offsetX: this.offsetX,
        offsetY: this.offsetY,
      },
      (s) => {
        this.angle = s.angle;
        this.updateStyle();
        this.updateNode();
      },
    );

    const up = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }

  translate(ref: { x: number; y: number; startX: number; startY: number }, onUpdate: (opts: any) => void) {
    let x = ref.x,
      y = ref.y,
      startX = ref.startX,
      startY = ref.startY;
    return (dragEvent: MouseEvent) => {
      const localX = dragEvent.clientX; //+ rect.left;
      const localY = dragEvent.clientY; //+ rect.top;

      x += localX - startX;
      y += localY - startY;

      onUpdate({ x: x, y: y });

      startX = localX;
      startY = localY;
    };
  }
}
