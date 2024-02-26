import { Sprite } from 'pixi.js';
import { getPixiWrapper } from '../devtool';
import { Throttle } from '../utils/throttle';
import { Transform } from './transform/Transform';

interface Overlay {
  transform: Transform;
  update: () => void;
}

let overlayWrapper: Overlay | null = null;
let canvas: HTMLCanvasElement | null = null;
let overlayEl: HTMLDivElement | null = null;

function buildOverlay() {
  overlayEl = document.createElement('div');
  Object.assign(overlayEl.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '0',
    height: '0',
    // pointerEvents: 'none',
    transformOrigin: 'top left',
  });

  // find the top most element
  let parent: HTMLElement | null = canvas;
  while (parent) {
    parent = parent?.parentElement;
    if (parent?.tagName === 'BODY') {
      parent.appendChild(overlayEl);
      break;
    }
  }
  console.log('overlayEl:', overlayEl);
}

function updateOverlay() {
  const pixiWrapper = getPixiWrapper();
  const canvas = pixiWrapper.canvas()!;
  const renderer = pixiWrapper.renderer()!;

  Object.assign(overlayEl!.style, {
    width: `${renderer.width / renderer.resolution}px`,
    height: `${renderer.height / renderer.resolution}px`,
  });
  const cBounds = canvas.getBoundingClientRect();
  overlayEl!.style.transform = '';
  const oBounds = overlayEl!.getBoundingClientRect();

  Object.assign(overlayEl!.style, {
    transform: `translate(${cBounds.x - oBounds.x}px, ${cBounds.y - oBounds.y}px) scale(${cBounds.width / oBounds.width}, ${cBounds.height / oBounds.height})`,
  });
}
const updateThrottle = new Throttle();
export function getOverlayWrapper(): Overlay {
  if (!overlayWrapper) {
    overlayWrapper = {
      transform: new Transform({ classPrefix: 'tr' }),
      update: function () {
        const pixiWrapper = getPixiWrapper();
        const newCanvas = pixiWrapper.canvas()!;

        if (newCanvas !== canvas) {
          canvas = newCanvas;
          // reset the overlay
          buildOverlay();
          this.transform.dom();
          overlayEl!.appendChild(this.transform.transform);
        }

        if (updateThrottle.shouldExecute(2500)) updateOverlay();

        const selectedNode = pixiWrapper.properties.getSelectedNode();

        if (!selectedNode) return;

        const worldTransform = selectedNode.worldTransform;
        const size = selectedNode.getBounds(false);

        this.transform.update({
          x: worldTransform.tx - (worldTransform.tx - size.x),
          y: worldTransform.ty - (worldTransform.ty - size.y),
          width: size.width,
          height: size.height,
          angle: selectedNode.angle,
          scaleX: worldTransform.a,
          scaleY: worldTransform.d,
          classPrefix: 'tr',
          onUpdate: (s: {
            width: number;
            height: number;
            x: number;
            y: number;
            scaleX: number;
            scaleY: number;
            angle: number;
          }) => {
            if (selectedNode.parent) {
              selectedNode.parent.worldTransform.applyInverse(s, s);
            } else {
              selectedNode.worldTransform.applyInverse(s, s);
            }
            selectedNode.x = s.x + selectedNode.pivot.x;
            selectedNode.y = s.y + selectedNode.pivot.y;
            if ((selectedNode as Sprite).anchor) {
              selectedNode.x += (selectedNode as Sprite).anchor.x * selectedNode.width;
              selectedNode.y += (selectedNode as Sprite).anchor.y * selectedNode.height;
            }
          },
        });
      },
    };
  }

  return overlayWrapper;
}
