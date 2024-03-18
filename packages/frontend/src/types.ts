import type { BridgeFn } from './lib/utils';
import type { SceneState } from './pages/scene/state';

export enum DevtoolMessage {
  active = 'pixi-active',
  inactive = 'pixi-inactive',
  stateUpdate = 'pixi-state-update',
}

export type PixiNodeType =
  | 'BitmapText'
  | 'HTMLText'
  | 'Text'
  | 'Mesh'
  | 'Graphics'
  | 'Sprite'
  | 'Container'
  | 'AnimatedSprite'
  | 'NineSliceSprite'
  | 'TilingSprite'
  | 'Unknown';
export interface PixiMetadata {
  type: PixiNodeType;
  uid: string;
  suffix?: string;
  isStage?: boolean;
}

export type SceneGraphEntry = {
  id: string;
  name: string;
  metadata: PixiMetadata;
  children: SceneGraphEntry[];
};

export interface DevtoolState extends SceneState {
  active: boolean;
  setActive: (active: DevtoolState['active']) => void;

  version: string | null;
  setVersion: (version: DevtoolState['version']) => void;

  sceneGraph: SceneGraphEntry | null;
  setSceneGraph: (sceneGraph: DevtoolState['sceneGraph']) => void;

  bridge: BridgeFn | null;
  setBridge: (bridge: DevtoolState['bridge']) => void;
}
