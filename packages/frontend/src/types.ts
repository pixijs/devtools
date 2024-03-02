import type { BridgeFn } from './lib/utils';
import type { SceneState } from './pages/scene/state';

export enum DevtoolMessage {
  active = 'pixi-active',
  inactive = 'pixi-inactive',
  stateUpdate = 'pixi-state-update',
}

export interface DevtoolState extends SceneState {
  active: boolean;
  setActive: (active: DevtoolState['active']) => void;

  version: string | null;
  setVersion: (version: DevtoolState['version']) => void;

  sceneGraph: Record<string, unknown> | null;
  setSceneGraph: (sceneGraph: DevtoolState['sceneGraph']) => void;

  bridge: BridgeFn | null;
  setBridge: (bridge: DevtoolState['bridge']) => void;
}
