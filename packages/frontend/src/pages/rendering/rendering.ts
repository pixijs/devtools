import type { ZustSet } from '../../lib/utils';
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
export interface RenderingState {
  selectedInstruction: number | null;
  setSelectedInstruction: (instruction: RenderingState['selectedInstruction']) => void;

  renderingData: { drawCalls: number; fps: number; rebuildFrequency: number } | null;
  setRenderingData: (data: RenderingState['renderingData']) => void;

  frameCaptureData: FrameCaptureData | null;
  setFrameCaptureData: (data: RenderingState['frameCaptureData']) => void;

  captureWithScreenshot: boolean;
  setCaptureWithScreenshot: (value: boolean) => void;
}

export const renderingStateSlice = (set: ZustSet<RenderingState>) => ({
  selectedInstruction: null,
  setSelectedInstruction: (instruction: RenderingState['selectedInstruction']) =>
    set((state) => ({ ...state, selectedInstruction: instruction })),

  renderingData: null,
  setRenderingData: (data: RenderingState['renderingData']) => set((state) => ({ ...state, renderingData: data })),

  frameCaptureData: null,
  setFrameCaptureData: (data: RenderingState['frameCaptureData']) =>
    set((state) => ({ ...state, frameCaptureData: data })),

  captureWithScreenshot: true,
  setCaptureWithScreenshot: (value: boolean) => set((state) => ({ ...state, captureWithScreenshot: value })),
});
