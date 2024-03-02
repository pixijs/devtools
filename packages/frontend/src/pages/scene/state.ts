import { ZustSet } from '../../lib/utils';
import { PropertyPanelData } from './scene-tree/Properties';

export interface SceneState {
  stats: Record<string, number> | null;
  setStats: (stats: SceneState['stats']) => void;

  selectedNode: string | null;
  setSelectedNode: (nodeId: SceneState['selectedNode']) => void;

  activeProps: PropertyPanelData[];
  setActiveProps: (props: SceneState['activeProps']) => void;
}

export const sceneStateSlice = (set: ZustSet<SceneState>) => ({
  stats: null,
  setStats: (stats: SceneState['stats']) => set({ stats: stats }),

  selectedNode: null,
  setSelectedNode: (nodeId: SceneState['selectedNode']) => set({ selectedNode: nodeId }),

  activeProps: [],
  setActiveProps: (props: SceneState['activeProps']) => set({ activeProps: props }),
});
