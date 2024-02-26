import type { Application, Container, Renderer } from 'pixi.js';
import type { flattenTree } from 'react-accessible-treeview';
import { PixiSceneObjectType } from './utils/getPixiType';
import { properties } from './properties/properties';
import { Prop } from './properties/propertyTypes';
import { MessageType } from '../messageUtils';
import { getOverlayWrapper } from './overlay/overlay';

export interface Pixi {
  pixi: () => typeof import('pixi.js');
  detectPixi: () => MessageType;
  app: () => Application | undefined;
  stage: () => Container | undefined;
  renderer: () => Renderer | undefined;
  canvas: () => HTMLCanvasElement | undefined;
  state: () => PixiState;
  version: () => string;
  properties: ReturnType<typeof properties>;
  overlay: () => ReturnType<typeof getOverlayWrapper>;
}

let pixiWrapper: Pixi | null = null;

export function getPixiWrapper(): Pixi {
  if (!pixiWrapper) {
    pixiWrapper = {
      app: () => {
        if (window.__PIXI_DEVTOOLS__?.app) {
          return window.__PIXI_DEVTOOLS__.app;
        }
        return window.__PIXI_APP__;
      },
      stage: () => {
        if (window.__PIXI_DEVTOOLS__?.stage) {
          return window.__PIXI_DEVTOOLS__.stage;
        } else if (window.__PIXI_STAGE__) {
          return window.__PIXI_STAGE__;
        }

        return pixiWrapper!.app()?.stage;
      },
      renderer: () => {
        if (window.__PIXI_DEVTOOLS__?.renderer) {
          return window.__PIXI_DEVTOOLS__.renderer;
        } else if (window.__PIXI_RENDERER__) {
          return window.__PIXI_RENDERER__;
        }

        return pixiWrapper!.app()?.renderer;
      },
      canvas: () => {
        const renderer = pixiWrapper!.renderer()!;
        const validKeys = ['canvas', 'view'] as const;

        // find the first valid key
        const key = validKeys.find((key) => renderer && key in renderer) as 'view' | 'canvas' | undefined;

        return key ? (renderer[key] as HTMLCanvasElement) : undefined;
      },
      state: () => {
        return getPixiState();
      },
      pixi: () => {
        if (window.__PIXI_DEVTOOLS__?.pixi) {
          return window.__PIXI_DEVTOOLS__.pixi;
        }
        return window.__PIXI__;
      },
      version: () => pixiWrapper!.pixi()?.VERSION ?? '',
      properties: properties(),
      detectPixi: () => {
        return pixiWrapper!.app() || pixiWrapper!.stage() || pixiWrapper!.renderer()
          ? MessageType.Active
          : MessageType.Inactive;
      },
      overlay: () => {
        return getOverlayWrapper();
      },
    };

    window.__PIXI_DEVTOOLS_WRAPPER__ = pixiWrapper;
  }

  return pixiWrapper;
}

export interface PixiMetadata {
  type: PixiSceneObjectType;
  uid: string;
  isStage?: boolean;
}

type ChildSceneGraph = Omit<Parameters<typeof flattenTree>[0], 'metadata' | 'children'> & {
  metadata: PixiMetadata;
  children: ChildSceneGraph[];
};

export interface PixiState {
  version: string;
  sceneStats: {
    totalSceneObjects: number;
    container: number;
    sprite: number;
    graphics: number;
    filter: number;
    mesh: number;
    text: number;
    bitmapText: number;
    htmlText: number;
  };
  sceneGraph: ChildSceneGraph;
  renderingStats: {
    fps: number;
    ms: number;
  };
  selectedNodeId: string | null;
  selectedNodeValues: Record<string, any>;
  selectedNodeProps: { values: Prop[]; keys: string[] };
}

let pixiState: PixiState | null = null;

function getPixiState(): PixiState {
  if (!pixiState) {
    pixiState = {
      version: '',
      sceneStats: {
        totalSceneObjects: 0,
        container: 0,
        sprite: 0,
        graphics: 0,
        filter: 0,
        mesh: 0,
        text: 0,
        bitmapText: 0,
        htmlText: 0,
      },
      renderingStats: {
        fps: 0,
        ms: 0,
      },
      sceneGraph: {
        id: 'root',
        name: 'root',
        children: [],
        metadata: {
          type: 'Container',
          uid: 'root',
        },
      },
      selectedNodeId: null,
      selectedNodeValues: {},
      selectedNodeProps: { values: [], keys: [] },
    };
  }

  return pixiState;
}

export function resetPixiState() {
  pixiState = null;
  getPixiState();
}
