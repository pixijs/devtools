import type { BridgeFn } from './lib/utils';
import type { TextureState } from './pages/assets/assets';
import type { RenderingState } from './pages/rendering/rendering';
import type { SceneState } from './pages/scene/state';
import type { ButtonMetadata, PixiMetadata } from '@pixi/devtools';

export enum DevtoolMessage {
  active = 'pixi-active',
  inactive = 'pixi-inactive',
  stateUpdate = 'pixi-state-update',
  pulse = 'pixi-pulse',
}

export type SceneGraphEntry = {
  id: string;
  name: string;
  metadata: PixiMetadata;
  children: SceneGraphEntry[];
};

export interface DevtoolState extends SceneState, TextureState, RenderingState {
  active: boolean;
  setActive: (active: DevtoolState['active']) => void;

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
}
