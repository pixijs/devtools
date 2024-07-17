import type { TextureDataState } from '@devtool/frontend/pages/assets/assets';
import type { PixiDevtools } from '../../pixi';
import type { TextureSource, GlTexture } from 'pixi.js';

const gpuTextureFormatSize: Record<string, number> = {
  r8unorm: 1,
  r8snorm: 1,
  r8uint: 1,
  r8sint: 1,
  r16uint: 2,
  r16sint: 2,
  r16float: 2,
  rg8unorm: 2,
  rg8snorm: 2,
  rg8uint: 2,
  rg8sint: 2,
  r32float: 4,
  r32uint: 4,
  r32sint: 4,
  rg16uint: 4,
  rg16sint: 4,
  rg16float: 4,
  rgba8unorm: 4,
  'rgba8unorm-srgb': 4,
  rgba8snorm: 4,
  rgba8uint: 4,
  rgba8sint: 4,
  bgra8unorm: 4,
  'bgra8unorm-srgb': 4,
  rgb10a2unorm: 4,
  rg11b10ufloat: 4,
  rgb9e5ufloat: 4,
  rg32float: 8,
  rg32uint: 8,
  rg32sint: 8,
  rgba16uint: 8,
  rgba16sint: 8,
  rgba16float: 8,
  rgba32float: 16,
  rgba32uint: 16,
  rgba32sint: 16,
  depth16unorm: 2,
  depth24plus: 3,
  'depth24plus-stencil8': 4,
  depth32float: 4,
  stencil8: 1,
  'depth32float-stencil8': 5,
};

const glTextureFormatSize: Record<number, number> = {
  6408: 4,
  6407: 3,
  33319: 2,
  6403: 1,
  36249: 4,
  36248: 3,
  33320: 2,
  36244: 1,
  6406: 1,
  6409: 1,
  6410: 2,
  6402: 1,
  34041: 2,
};

export class Textures {
  private _devtool: typeof PixiDevtools;
  private _textures: Map<number, string> = new Map();
  private _gpuTextureSize: Map<number, number> = new Map();

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public init() {
    this._textures.clear();
    this._gpuTextureSize.clear();
  }

  public update() {}

  public complete() {}

  public get() {
    const currentTextures = this._devtool.renderer.texture.managedTextures;
    // @ts-expect-error - private property
    const glTextures = this._devtool.renderer.texture['_glTextures'] as Record<number, GlTexture | GPUTexture>;

    const data: TextureDataState[] = [];
    currentTextures.forEach((texture) => {
      if (!this._textures.get(texture.uid)) {
        const res = this._getTextureSource(texture);
        if (res) {
          this._textures.set(texture.uid, res);
        }
      }

      if (!this._gpuTextureSize.has(texture.uid)) {
        const size = this._getMemorySize(texture, glTextures[texture.uid]);
        if (size) {
          this._gpuTextureSize.set(texture.uid, size);
        }
      }

      data.push({
        name: texture.label,
        gpuSize: this._gpuTextureSize.get(texture.uid) || 0,
        pixelWidth: texture.pixelWidth,
        pixelHeight: texture.pixelHeight,
        width: texture.width,
        height: texture.height,
        mipLevelCount: texture.mipLevelCount,
        autoGenerateMipmaps: texture.autoGenerateMipmaps,
        format: texture.format,
        dimension: texture.dimension,
        alphaMode: texture.alphaMode,
        antialias: texture.antialias,
        destroyed: texture.destroyed,
        isPowerOfTwo: texture.isPowerOfTwo,
        autoGarbageCollect: texture.autoGarbageCollect,
        blob: this._textures.get(texture.uid) || null,
        isLoaded: !!glTextures[texture.uid],
      });
    });

    return data;
  }

  private _getTextureSource(texture: TextureSource) {
    if (texture.resource instanceof ImageBitmap) {
      return this._imageBitmapToString(texture.resource);
    } else if (texture.resource instanceof HTMLCanvasElement) {
      return this._canvasToString(texture.resource);
    }
    return null;
  }

  private _imageBitmapToString(imageBitmap: ImageBitmap | HTMLImageElement | HTMLVideoElement): string {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    // Get the context of the canvas
    const ctx = canvas.getContext('2d')!;

    // Draw the ImageBitmap on the canvas
    ctx.drawImage(imageBitmap, 0, 0);

    const res = this._canvasToString(canvas);

    // Convert the canvas to a blob
    return res;
  }

  private _canvasToString(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }

  private _getMemorySize(texture: TextureSource, webTexture: GlTexture | GPUTexture): number | null {
    if (!webTexture) return null;
    if (Array.isArray(texture.resource) && texture.resource[0] instanceof Uint8Array) {
      return texture.resource.reduce((acc, res) => acc + res.byteLength, 0);
    }

    if (typeof webTexture.format === 'string' && gpuTextureFormatSize[webTexture.format]) {
      return webTexture.width * webTexture.height * gpuTextureFormatSize[webTexture.format];
    } else if (typeof webTexture.format === 'number' && glTextureFormatSize[webTexture.format]) {
      return webTexture.width * webTexture.height * glTextureFormatSize[webTexture.format];
    }

    return null;
  }
}

// extensions.handleByList('overlay', Overlay.extensions);
