import { scale, rotate, translate, styler } from 'free-transform';

interface TransformOptions {
  classPrefix: string;
  width: number;
  height: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  scaleLimit?: number;
  disableScale?: boolean;
  offsetX?: number;
  offsetY?: number;
  onUpdate?: (opts: any) => void;
}

export class Transform {
  classPrefix: string;
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
  onUpdate!: () => void;

  transform!: HTMLElement;
  controls!: HTMLElement;
  content!: HTMLElement;
  scalePoints!: HTMLElement[];
  rotator!: HTMLDivElement;

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
    dom.addEventListener('mousedown', this.handleTranslation);

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
      // backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid var(--primary-color)',
    });

    const controls = document.createElement('div');
    controls.className = `${this.classPrefix}-transform__controls`;
    Object.assign(controls.style, style.controls);

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
    this.width = options.width;
    this.height = options.height;
    this.x = options.x;
    this.y = options.y;
    this.scaleX = options.scaleX;
    this.scaleY = options.scaleY;
    this.scaleLimit = options.scaleLimit || 0.1;
    this.angle = options.angle;
    this.disableScale = options.disableScale || false;
    this.offsetX = options.offsetX || 0;
    this.offsetY = options.offsetY || 0;
    this.onUpdate =
      options.onUpdate ||
      function () {
        /** */
      };

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

  handleTranslation(event: MouseEvent) {
    event.stopPropagation();

    const startX = event.pageX;
    const startY = event.pageY;

    const drag = translate(
      {
        x: this.x,
        y: this.y,
        startX,
        startY,
      },
      this.onUpdate,
    );

    const up = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }

  handleScale(scaleType: string, event: MouseEvent) {
    event.stopPropagation();

    event.preventDefault();

    const drag = scale(
      scaleType,
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
        scaleLimit: this.scaleLimit,
        scaleFromCenter: event.altKey,
        aspectRatio: event.shiftKey,
      },
      this.onUpdate,
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
      this.onUpdate,
    );

    const up = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }
}
