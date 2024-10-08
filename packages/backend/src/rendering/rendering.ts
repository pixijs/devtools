import type {
  BaseInstruction,
  BatchInstruction,
  FilterInstruction,
  GraphicsInstruction,
  MaskInstruction,
  MeshInstruction,
  NineSliceInstruction,
  RenderingTextureDataState,
  TilingSpriteInstruction,
} from '@devtool/frontend/pages/rendering/instructions/Instructions';
import type { FrameCaptureData, RenderingState } from '@devtool/frontend/pages/rendering/rendering';
import type {
  Batch,
  BatcherPipe,
  CanvasSource,
  Container,
  GlGeometrySystem,
  Graphics,
  InstructionPipe,
  Mesh,
  NineSliceSprite,
  FilterInstruction as PixiFilterInstruction,
  RenderContainer,
  Renderer,
  RenderGroup,
  StencilMaskInstruction,
  TextureSource,
  TilingSprite,
  WebGLRenderer,
  WebGPURenderer,
} from 'pixi.js';
import { PixiHandler } from '../handler';
import { getPixiType } from '../utils/getPixiType';
import { loop } from '../utils/loop';
import {
  getBatchInstruction,
  getCustomRenderableInstruction,
  getFilterInstruction,
  getGraphicsInstruction,
  getMaskInstruction,
  getMeshInstruction,
  getNineSliceInstruction,
  getTileSpriteInstruction,
} from './instructions';
import { readGlPixels } from './readPixels';
import { Stats } from './stats';

interface PixiMeshObjectInstruction {
  renderPipeId: string;
  mesh: Mesh;
}

export class Rendering extends PixiHandler {
  private _textureCache: Map<TextureSource, RenderingTextureDataState> = new Map();

  private _glDrawFn!: GlGeometrySystem['draw'];
  private _batcherBuildStartFn!: BatcherPipe['buildStart'];
  private _originalBeginRenderPass!: WebGPURenderer['encoder']['beginRenderPass'];
  private _originalRestoreRenderPass!: WebGPURenderer['encoder']['restoreRenderPass'];

  private _drawOrder: { pipe: string; drawCalls: number }[] = [];
  private _pipeExecuteFn: Map<string, InstructionPipe<any>['execute']> = new Map();

  private _capturing = false;
  private _currentPipe: string | null = null;
  private _withScreenshot = false;
  private _canvasTextures: string[] = [];

  private _rebuilt = false;

  private stats = new Stats();

  public override reset() {
    if (this._devtool.majorVersion !== '8') {
      return;
    }

    // restore all overriden functions
    const renderer = this._devtool.renderer;

    if (!this._batcherBuildStartFn) return;

    renderer.renderPipes.batch.buildStart = this._batcherBuildStartFn;

    if (renderer.type === 0b10) {
      const gpuRenderer = renderer as WebGPURenderer;
      const encoder = gpuRenderer.encoder;
      encoder.beginRenderPass = this._originalBeginRenderPass;
      encoder.restoreRenderPass = this._originalRestoreRenderPass;
    } else {
      const glRenderer = renderer as WebGLRenderer;
      glRenderer.geometry.draw = this._glDrawFn;
    }
  }

  public override init() {
    if (this._devtool.majorVersion !== '8') {
      return;
    }

    this._textureCache.clear();
    this.stats.reset();

    this._capturing = false;
    this._currentPipe = null;
    this._canvasTextures = [];

    // override the draw function to keep track of draw calls
    const renderer = this._devtool.renderer;

    // override the batcher buildStart function to keep track of rebuild frequency
    this._batcherBuildStartFn = renderer.renderPipes.batch.buildStart;
    renderer.renderPipes.batch.buildStart = (...args) => {
      const res = this._batcherBuildStartFn.apply(renderer.renderPipes.batch, args);
      this._rebuilt = true;

      return res;
    };

    if (renderer.type === 0b10) {
      const gpuRenderer = renderer as WebGPURenderer;
      const drawOverride = (id: 'draw' | 'drawIndexed') => {
        const originalDraw = encoder.renderPassEncoder[id];
        encoder.renderPassEncoder[id] = (...args) => {
          if (this._capturing) {
            if (this._currentPipe) {
              const pipe = this._drawOrder.at(-1);
              if (pipe) {
                pipe.drawCalls++;
              }
            }
          }

          const res = originalDraw.apply(encoder.renderPassEncoder, args as any);
          this.stats.drawCalls++;

          if (!this._capturing) return res;
          if (!this._withScreenshot) return res;

          // readGPUPixels(gpuRenderer, this._canvasTextures);
          return res;
        };
      };
      const encoder = gpuRenderer.encoder;
      this._originalBeginRenderPass = encoder.beginRenderPass;
      encoder.beginRenderPass = (...args) => {
        const res = this._originalBeginRenderPass.apply(encoder, args);

        drawOverride('draw');
        drawOverride('drawIndexed');

        return res;
      };
      this._originalRestoreRenderPass = encoder.restoreRenderPass;
      encoder.restoreRenderPass = (...args) => {
        const res = this._originalRestoreRenderPass.apply(encoder, args);

        drawOverride('draw');
        drawOverride('drawIndexed');

        return res;
      };
      return;
    }

    const glRenderer = renderer as WebGLRenderer;

    this._glDrawFn = glRenderer.geometry.draw;
    const gl = glRenderer.gl;
    glRenderer.geometry.draw = (...args) => {
      if (this._capturing) {
        if (this._currentPipe) {
          const pipe = this._drawOrder.at(-1);
          if (pipe) {
            pipe.drawCalls++;
          }
        }
      }

      const res = this._glDrawFn.apply(glRenderer.geometry, args);
      this.stats.drawCalls++;

      if (!this._capturing) return res;
      if (!this._withScreenshot) return res;

      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      readGlPixels(gl, glRenderer, this._canvasTextures, width, height);
      return res;
    };
  }

  public override update() {
    if (this._devtool.majorVersion !== '8') {
      return;
    }

    this.stats.drawCalls = 0;
    this.stats.update();
  }

  public captureCanvasData(): RenderingState['canvasData'] {
    const renderer = this._devtool.renderer;
    // const webgpuRenderer = renderer as WebGPURenderer;
    const webglRenderer = renderer as WebGLRenderer;
    const canvas = renderer.view.canvas as HTMLCanvasElement;

    let powerPreference: 'default' | 'high-performance' | 'low-power' = 'default';
    let failIfMajorPerformanceCaveat: string | undefined = undefined;
    let preserveDrawingBuffer: string = '';
    let premultipliedAlpha: string = '';
    if (renderer.type !== 0b10) {
      const contextAttributes = webglRenderer.gl.getContextAttributes()!;
      powerPreference = contextAttributes.powerPreference as 'default' | 'high-performance' | 'low-power';
      failIfMajorPerformanceCaveat = contextAttributes.failIfMajorPerformanceCaveat?.toString();
      preserveDrawingBuffer = contextAttributes.preserveDrawingBuffer?.toString() ?? '';
      premultipliedAlpha = contextAttributes.premultipliedAlpha?.toString() ?? '';
    }

    return {
      type: this._devtool.rendererType!,
      width: canvas.width,
      height: canvas.height,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight,
      browserAgent: navigator.userAgent,

      background: renderer.background.color.toHex(),
      backgroundAlpha: renderer.background.alpha.toString(),
      antialias: renderer.view.antialias.toString(),
      autoDensity: (renderer.view.texture.source as CanvasSource).autoDensity.toString(),
      clearBeforeRender: renderer.background.clearBeforeRender.toString(),
      depth: renderer.view.renderTarget.depth.toString(),
      powerPreference,
      preserveDrawingBuffer,
      premultipliedAlpha,
      resolution: renderer.resolution.toString(),
      roundPixels: renderer.roundPixels.toString(),
      failIfMajorPerformanceCaveat,

      // @ts-expect-error - private properties
      renderableGCActive: renderer.renderableGC?.enabled.toString(),
      // @ts-expect-error - private properties
      renderableGCFrequency: renderer.renderableGC?._frequency.toString(),
      // @ts-expect-error - private properties
      renderableGCMaxUnusedTime: renderer.renderableGC?.maxUnusedTime.toString(),
      textureGCAMaxIdle: renderer.textureGC.maxIdle.toString(),
      textureGCActive: renderer.textureGC.active.toString(),
      textureGCCheckCountMax: renderer.textureGC.checkCountMax.toString(),
    };
  }

  public captureRenderingData(): RenderingState['renderingData'] {
    const rebuildFrequency = this._rebuilt ? 1 : 0;
    this._rebuilt = false;
    return {
      drawCalls: this.stats.drawCalls,
      fps: Number(this.stats.fps.toFixed(0)),
      rebuildFrequency,
    };
  }

  public capture(withScreenshot: boolean): FrameCaptureData {
    this._textureCache.clear();
    const renderer = this._devtool.renderer;
    const lastObjectRendered = renderer.lastObjectRendered;
    const instructionSet = lastObjectRendered.renderGroup.instructionSet;
    const frameCaptureData: FrameCaptureData = {
      instructions: [],
      drawCalls: 0,
      totals: {
        containers: 0,
        graphics: 0,
        meshes: 0,
        sprites: 0,
        texts: 0,
        tilingSprites: 0,
        nineSliceSprites: 0,
        filters: 0,
        masks: 0,
      },
      renderTime: this._getRenderTime(renderer),
    };

    const canvasTextures = this._capture(renderer, withScreenshot);
    const sceneData = this._getSceneData(lastObjectRendered);
    const instructionData = this._getInstructionsData(instructionSet, canvasTextures, this._drawOrder);
    frameCaptureData.drawCalls = canvasTextures.length;
    frameCaptureData.instructions = instructionData;
    frameCaptureData.totals = sceneData;

    return frameCaptureData;
  }

  private _capture(renderer: Renderer, withScreenshot: boolean) {
    this._drawOrder = [];
    this._pipeExecuteFn.clear();

    this._capturing = true;
    this._withScreenshot = withScreenshot;
    this._currentPipe = null;
    this._canvasTextures = [];

    const instructionSet = renderer.lastObjectRendered.renderGroup.instructionSet;
    const renderPipes = instructionSet.renderPipes as Record<string, InstructionPipe<any>>;

    // override each execute function to keep track of draw calls
    Object.keys(renderPipes).forEach((key) => {
      const pipe = renderPipes[key];
      if (!pipe.execute) return;

      this._pipeExecuteFn.set(key, pipe.execute);
      pipe.execute = (...args) => {
        this._currentPipe = key;
        this._drawOrder.push({ pipe: key, drawCalls: 0 });
        const res = this._pipeExecuteFn.get(key)!.apply(pipe, args);
        return res;
      };
    });

    renderer.render(renderer.lastObjectRendered);

    this._postCapture(renderer);

    return this._canvasTextures;
  }

  private _postCapture(renderer: Renderer) {
    const renderPipes = renderer.lastObjectRendered.renderGroup.instructionSet.renderPipes as Record<
      string,
      InstructionPipe<any>
    >;
    Object.keys(renderPipes).forEach((key) => {
      const pipe = renderPipes[key];
      if (!pipe.execute) return;
      pipe.execute = this._pipeExecuteFn.get(key)!;
    });

    this._capturing = false;
  }

  private _getRenderTime(renderer: Renderer) {
    const now = performance.now();
    renderer.render(renderer.lastObjectRendered);
    return performance.now() - now;
  }

  private _getSceneData(lastObjectRendered: Container) {
    const data: FrameCaptureData['totals'] = {
      containers: 0,
      graphics: 0,
      meshes: 0,
      sprites: 0,
      texts: 0,
      tilingSprites: 0,
      nineSliceSprites: 0,
      filters: 0,
      masks: 0,
    };
    loop({
      container: lastObjectRendered,
      loop(container) {
        const type = getPixiType(container);

        switch (type) {
          case 'Container':
            data.containers++;
            break;
          case 'Graphics':
            data.graphics++;
            break;
          case 'Mesh':
            data.meshes++;
            break;
          case 'Sprite':
          case 'AnimatedSprite':
            data.sprites++;
            break;
          case 'Text':
          case 'BitmapText':
          case 'HTMLText':
            data.texts++;
            break;
          case 'TilingSprite':
            data.tilingSprites++;
            break;
          case 'NineSliceSprite':
            data.nineSliceSprites++;
            break;
        }

        if (container.effects) {
          data.filters += Array.isArray(container.effects) ? container.effects.length : 1;
        }

        if (container.mask) {
          data.masks++;
        }
      },
    });

    return data;
  }

  private _getInstructionsData(
    instructionSet: RenderGroup['instructionSet'],
    canvasTextures: string[],
    drawOrder: { pipe: string; drawCalls: number }[],
    drawTotal = 0,
    instructionCount = 0,
  ) {
    const instructionData: FrameCaptureData['instructions'] = [];

    instructionData.push({
      type: 'Render Group',
      action: 'start',
      drawCalls: 0,
      drawTextures: [],
    });

    for (let i = 0; i < instructionSet.instructionSize; i++) {
      const instruction = instructionSet.instructions[i];
      let data:
        | BaseInstruction
        | BatchInstruction
        | FilterInstruction
        | GraphicsInstruction
        | MaskInstruction
        | MeshInstruction
        | TilingSpriteInstruction
        | NineSliceInstruction = null as any;

      switch (instruction.renderPipeId) {
        case 'batch':
          data = getBatchInstruction(instruction as Batch, this._textureCache);
          break;
        case 'filter':
          data = getFilterInstruction(instruction as PixiFilterInstruction, this._textureCache);
          break;
        case 'stencilMask':
        case 'alphaMask':
        case 'colorMask':
          data = getMaskInstruction(instruction as StencilMaskInstruction, this._textureCache);
          break;
        case 'tilingSprite':
          data = getTileSpriteInstruction(instruction as TilingSprite, this._textureCache);
          break;
        case 'mesh':
          data = getMeshInstruction(instruction as Mesh | PixiMeshObjectInstruction, this._textureCache);
          break;
        case 'graphics':
          data = getGraphicsInstruction(instruction as Graphics, this._textureCache);
          break;
        case 'nineSliceSprite':
          data = getNineSliceInstruction(instruction as unknown as NineSliceSprite, this._textureCache);
          break;
        case 'customRender':
          data = getCustomRenderableInstruction(instruction as RenderContainer, this._textureCache);
          break;
        case 'renderGroup':
          {
            const res = this._getInstructionsData(
              (instruction as RenderGroup).instructionSet,
              canvasTextures,
              drawOrder,
              drawTotal,
              instructionCount + 1,
            );
            instructionData.push(...res);
          }
          break;
        default:
          data = {
            type: instruction.renderPipeId as any,
            action: instruction.action ?? 'unknown',
          } as BaseInstruction;
          break;
      }

      if (!data) continue;

      const drawOrderData = drawOrder[instructionCount];
      data.drawCalls = drawOrderData.drawCalls;
      drawTotal += data.drawCalls;
      data.drawTextures = canvasTextures.slice(drawTotal - data.drawCalls, drawTotal);

      instructionCount++;

      instructionData.push(data);
    }

    instructionData.push({
      type: 'Render Group',
      action: 'end',
      drawCalls: 0,
      drawTextures: [],
    });

    return instructionData;
  }
}
