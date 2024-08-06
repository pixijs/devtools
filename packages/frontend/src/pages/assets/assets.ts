import type { ZustSet } from '../../lib/utils';
import type { ALPHA_MODES, TEXTURE_DIMENSIONS, TEXTURE_FORMATS } from 'pixi.js';
import type { RemoveSetters } from '../../types';

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
  setSelectedTexture: (texture: TextureDataState | null) => set((state) => ({ ...state, selectedTexture: texture })),
  setTextures: (textures: TextureDataState[]) => set((state) => ({ ...state, textures })),
});

export const textureStateSelectors: RemoveSetters<TextureState> = {
  selectedTexture: null,
  textures: [],
};
