import type { ZustSet } from '../../lib/utils';
import type { ALPHA_MODES, TEXTURE_DIMENSIONS, TEXTURE_FORMATS } from 'pixi.js';

export interface TextureDataState {
  gpuSize: number;
  pixelWidth: number;
  pixelHeight: number;
  width: number;
  height: number;
  mipLevelCount: number;
  autoGenerateMipmaps: boolean;
  format: TEXTURE_FORMATS;
  dimension: TEXTURE_DIMENSIONS;
  alphaMode: ALPHA_MODES;
  antialias: boolean;
  destroyed: boolean;
  isPowerOfTwo: boolean;
  autoGarbageCollect: boolean;
  blob: string | null;
  isLoaded: boolean;
  name: string;
}

export interface TextureState {
  selectedTexture: TextureDataState | null;
  setSelectedTexture: (texture: TextureDataState | null) => void;

  textures: TextureDataState[];
  setTextures: (textures: TextureDataState[]) => void;
}

export const textureStateSlice = (set: ZustSet<TextureState>) => ({
  selectedTexture: null,
  setSelectedTexture: (texture: TextureDataState | null) => set((state) => ({ ...state, selectedTexture: texture })),

  textures: [],
  setTextures: (textures: TextureDataState[]) => set((state) => ({ ...state, textures })),
});
