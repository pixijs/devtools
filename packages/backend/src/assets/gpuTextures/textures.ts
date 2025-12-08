import type { TextureDataState } from '@devtool/frontend/pages/assets/assets';
import type { CanvasSource, GlTexture, TextureSource, WebGLRenderer } from 'pixi.js';
import { PixiHandler } from '../../handler';

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

export class Textures extends PixiHandler {
  private _textures: Map<number, string> = new Map();
  private _gpuTextureSize: Map<number, number> = new Map();
  private _canvas = document.createElement('canvas');
  private _previousData: TextureDataState[] = [];

  public override init() {
    this._textures.clear();
    this._gpuTextureSize.clear();
  }

  public override reset() {
    this._textures.clear();
    this._gpuTextureSize.clear();
    this._previousData = [];
  }

  public override update() {}

  public get() {
    const currentTextures = this._devtool.renderer.texture.managedTextures;
    const glTextures = this.getWebTextures();

    const data: TextureDataState[] = [];
    currentTextures.forEach((texture) => {
      if (!texture) return;
      if (!texture.resource) return;

      if (!this._textures.get(texture.uid)) {
        const res = this.getTextureSource(texture);
        if (res) {
          this._textures.set(texture.uid, res);
        }
      }

      if (!this._gpuTextureSize.has(texture.uid)) {
        const size = this.getMemorySize(texture, glTextures[texture.uid]);
        if (size) {
          this._gpuTextureSize.set(texture.uid, size);
        }
      }

      data.push({
        uid: texture.uid,
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

    if (!('_glTextures' in this._devtool.renderer.texture)) {
      // currentTextures can now contain null values, these null values are the textures that have been garbage collected
      // we need to map these null values to the previous data so we can add them back to the data array
      // loop through the previous data and any texture that is not in the current data array, add it back to the data array
      const currentUids = new Set(data.map((t) => t.uid));
      this._previousData.forEach((previousTexture) => {
        if (!currentUids.has(previousTexture.uid)) {
          data.push({ ...previousTexture, isLoaded: false });
        }
      });
      this._previousData = data.slice();
    }

    return data;
  }

  public getWebTextures() {
    const renderer = this._devtool.renderer as WebGLRenderer;

    let glTextures: Record<number, GlTexture | GPUTexture> = {};
    const textureSystem = renderer.texture as unknown as
      | { _glTextures: Record<number, GlTexture> }
      | { _gpuSources: Record<number, GPUTexture> }
      | { managedTextures: Readonly<TextureSource[]> };

    if ('_glTextures' in textureSystem || '_gpuSources' in textureSystem) {
      glTextures = '_glTextures' in textureSystem ? textureSystem['_glTextures'] : textureSystem['_gpuSources'];
    } else {
      // we are now using pixi 8.15
      const managedTextures = textureSystem.managedTextures;
      glTextures = managedTextures.reduce(
        (acc, texture) => {
          if (!texture) return acc;
          // @ts-expect-error - pixi 8.15 introduced a new property _gpuData
          const gpuData = texture._gpuData[this._devtool.renderer.uid];
          if (!gpuData) return acc;

          acc[texture.uid] = 'gpuTexture' in gpuData ? gpuData.gpuTexture : gpuData;
          return acc;
        },
        {} as Record<number, GlTexture | GPUTexture>,
      );
    }

    return glTextures;
  }

  public getTextureSource(texture: TextureSource) {
    if (
      texture.resource instanceof ImageBitmap ||
      texture.resource instanceof HTMLImageElement ||
      texture.resource instanceof HTMLVideoElement
    ) {
      return this._imageBitmapToString(texture.resource);
    } else if (texture.resource instanceof HTMLCanvasElement) {
      return this._canvasToString(texture.resource);
    }

    // in an iframe instanceof does not work due to different window objects
    // we now try using the textures uploadID
    if (texture.uploadMethodId === 'image' || texture.uploadMethodId === 'video') {
      if ((texture as CanvasSource).resizeCanvas) {
        return this._canvasToString(texture.resource);
      }
      return this._imageBitmapToString(texture.resource);
    }

    // TODO buffer resource and compressed texture

    return null;
  }

  private _imageBitmapToString(imageBitmap: ImageBitmap | HTMLImageElement | HTMLVideoElement): string {
    // Create a canvas element
    this._canvas.width = imageBitmap.width;
    this._canvas.height = imageBitmap.height;

    // Get the context of the canvas
    const ctx = this._canvas.getContext('2d')!;

    // Draw the ImageBitmap on the canvas
    ctx.drawImage(imageBitmap, 0, 0);

    const res = this._canvasToString(this._canvas);

    // Convert the canvas to a blob
    return res;
  }

  private _canvasToString(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }

  public getMemorySize(texture: TextureSource, webTexture: GlTexture | GPUTexture): number | null {
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
