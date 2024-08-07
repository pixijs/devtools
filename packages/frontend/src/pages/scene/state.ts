import type { ZustSet } from '../../lib/utils';
import type { PropertyPanelData } from '../../components/properties/propertyTypes';
import type { RemoveSetters } from '../../types';

export interface SceneState {
  stats: Record<string, number> | null;
  setStats: (stats: SceneState['stats']) => void;

  selectedNode: string | null;
  setSelectedNode: (nodeId: SceneState['selectedNode']) => void;

  activeProps: PropertyPanelData[];
  setActiveProps: (props: SceneState['activeProps']) => void;

  overlayPickerEnabled: boolean;
  setOverlayPickerEnabled: (enabled: SceneState['overlayPickerEnabled']) => void;

  overlayHighlightEnabled: boolean;
  setOverlayHighlightEnabled: (enabled: SceneState['overlayHighlightEnabled']) => void;
}

export const sceneStateSlice = (set: ZustSet<SceneState>) => ({
  setStats: (stats: SceneState['stats']) => set({ stats: stats }),
  setSelectedNode: (nodeId: SceneState['selectedNode']) => set({ selectedNode: nodeId }),
  setActiveProps: (props: SceneState['activeProps']) => set({ activeProps: props }),
  setOverlayPickerEnabled: (enabled: SceneState['overlayPickerEnabled']) => set({ overlayPickerEnabled: enabled }),
  setOverlayHighlightEnabled: (enabled: SceneState['overlayHighlightEnabled']) =>
    set({ overlayHighlightEnabled: enabled }),
});

export const sceneStateSelectors: RemoveSetters<SceneState> = {
  stats: null,
  selectedNode: null,
  activeProps: [],
  overlayPickerEnabled: false,
  overlayHighlightEnabled: true,
};
