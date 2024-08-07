import type { ZustSet } from '../../lib/utils';
import type { RemoveSetters } from '../../types';
import type {
  BaseInstruction,
  BatchInstruction,
  CustomRenderableInstruction,
  FilterInstruction,
  GraphicsInstruction,
  MaskInstruction,
  MeshInstruction,
  NineSliceInstruction,
  TilingSpriteInstruction,
} from './instructions/Instructions';

export interface FrameCaptureData {
  instructions:
    | (
        | BaseInstruction
        | BatchInstruction
        | MaskInstruction
        | FilterInstruction
        | TilingSpriteInstruction
        | MeshInstruction
        | GraphicsInstruction
        | NineSliceInstruction
        | CustomRenderableInstruction
      )[]
    | null;
  drawCalls: number;
  renderTime: number;
  totals: {
    containers: number;
    graphics: number;
    meshes: number;
    sprites: number;
    texts: number;
    tilingSprites: number;
    nineSliceSprites: number;
    filters: number;
    masks: number;
  };
}

export interface CanvasData {
  width: number;
  height: number;
  clientWidth: number;
  clientHeight: number;
  browserAgent: string;
  backgroundAlpha: string;
  antialias: string;
  depth: string;
  premultipliedAlpha: string;
  preserveDrawingBuffer: string;
  powerPreference: 'default' | 'high-performance' | 'low-power';
  type: 'webgl' | 'webgl2' | 'webgpu';
  resolution: string;
  roundPixels: string;
  autoDensity: string;
  background: string;
  clearBeforeRender: string;
  failIfMajorPerformanceCaveat: string | undefined;
  renderableGCFrequency: string;
  renderableGCActive: string;
  renderableGCMaxUnusedTime: string;
  textureGCAMaxIdle: string;
  textureGCActive: string;
  textureGCCheckCountMax: string;
}
export interface RenderingState {
  selectedInstruction: number | null;
  setSelectedInstruction: (instruction: RenderingState['selectedInstruction']) => void;

  renderingData: { drawCalls: number; fps: number; rebuildFrequency: number } | null;
  setRenderingData: (data: RenderingState['renderingData']) => void;

  frameCaptureData: FrameCaptureData | null;
  setFrameCaptureData: (data: RenderingState['frameCaptureData']) => void;

  captureWithScreenshot: boolean;
  setCaptureWithScreenshot: (value: boolean) => void;

  disableCaptureWithScreenshot: boolean;
  setDisableCaptureWithScreenshot: (value: boolean) => void;

  canvasData: CanvasData | null;
  setCanvasData: (data: RenderingState['canvasData']) => void;
}

export const renderingStateSlice = (set: ZustSet<RenderingState>) => ({
  setSelectedInstruction: (instruction: RenderingState['selectedInstruction']) =>
    set((state) => ({ ...state, selectedInstruction: instruction })),
  setRenderingData: (data: RenderingState['renderingData']) => set((state) => ({ ...state, renderingData: data })),
  setFrameCaptureData: (data: RenderingState['frameCaptureData']) =>
    set((state) => ({ ...state, frameCaptureData: data })),
  captureWithScreenshot: true,
  setCaptureWithScreenshot: (value: boolean) => set((state) => ({ ...state, captureWithScreenshot: value })),
  setDisableCaptureWithScreenshot: (value: boolean) =>
    set((state) => ({ ...state, disableCaptureWithScreenshot: value })),
  setCanvasData: (data: RenderingState['canvasData']) => set((state) => ({ ...state, canvasData: data })),
});

export type PermanentRenderingStateKeys = 'captureWithScreenshot';
export const renderingStateSelectors: Omit<RemoveSetters<RenderingState>, PermanentRenderingStateKeys> = {
  selectedInstruction: null,
  renderingData: null,
  frameCaptureData: null,
  disableCaptureWithScreenshot: false,
  canvasData: null,
};
