import type { BridgeFn } from './lib/utils';
import type { TextureState } from './pages/assets/assets';
import type { PermanentRenderingStateKeys, RenderingState } from './pages/rendering/rendering';
import type { SceneState } from './pages/scene/scene';
import type { ButtonMetadata, PixiMetadata } from '@pixi/devtools';

export enum DevtoolMessage {
  active = 'pixi-active',
  inactive = 'pixi-inactive',
  stateUpdate = 'pixi-state-update',
  pulse = 'pixi-pulse',

  panelShown = 'devtool:panelShown',
  panelHidden = 'devtool:panelHidden',

  pageReload = 'devtool:pageReload',

  overlayStateUpdate = 'pixi-overlay-state-update',
}

export type SceneGraphEntry = {
  id: string;
  name: string;
  metadata: PixiMetadata;
  children: SceneGraphEntry[];
};

export interface GlobalDevtoolState {
  active: boolean;
  setActive: (active: DevtoolState['active']) => void;
  version: string | null;
  setVersion: (version: DevtoolState['version']) => void;
}

export interface DevtoolState extends GlobalDevtoolState, SceneState, TextureState, RenderingState {
  chromeProxy: typeof chrome | null;
  setChromeProxy: (chromeProxy: DevtoolState['chromeProxy']) => void;

  version: string | null;
  setVersion: (version: DevtoolState['version']) => void;

  sceneGraph: SceneGraphEntry | null;
  setSceneGraph: (sceneGraph: DevtoolState['sceneGraph']) => void;

  bridge: BridgeFn | null;
  setBridge: (bridge: DevtoolState['bridge']) => void;

  sceneTreeData: {
    buttons: ButtonMetadata[];
  } | null;
  setSceneTreeData: (data: DevtoolState['sceneTreeData']) => void;

  reset: () => void;
}

// Utility type to remove properties starting with 'set'
export type RemoveSetters<T> = {
  [K in keyof T as K extends `set${string}` ? never : K]: T[K];
};

export type DevtoolStateSelectors = Omit<
  RemoveSetters<DevtoolState>,
  'reset' | 'chromeProxy' | 'bridge' | PermanentRenderingStateKeys
>;
