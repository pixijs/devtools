import type { ZustSet } from '../../lib/utils';
import type { PropertyPanelData } from '../../components/properties/propertyTypes';

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
  stats: null,
  setStats: (stats: SceneState['stats']) => set({ stats: stats }),

  selectedNode: null,
  setSelectedNode: (nodeId: SceneState['selectedNode']) => set({ selectedNode: nodeId }),

  activeProps: [],
  setActiveProps: (props: SceneState['activeProps']) => set({ activeProps: props }),

  overlayPickerEnabled: false,
  setOverlayPickerEnabled: (enabled: SceneState['overlayPickerEnabled']) => set({ overlayPickerEnabled: enabled }),

  overlayHighlightEnabled: true,
  setOverlayHighlightEnabled: (enabled: SceneState['overlayHighlightEnabled']) =>
    set({ overlayHighlightEnabled: enabled }),
});
