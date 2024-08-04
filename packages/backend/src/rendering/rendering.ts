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
  GlGeometrySystem,
  Graphics,
  InstructionPipe,
  Mesh,
  NineSliceSprite,
  FilterInstruction as PixiFilterInstruction,
  StencilMaskInstruction,
  TextureSource,
  TilingSprite,
  WebGLRenderer,
  RenderGroup,
  Container,
  CanvasSource,
} from 'pixi.js';
import type { PixiDevtools } from '../pixi';
import { getPixiType } from '../utils/getPixiType';
import { loop } from '../utils/loop';
import {
  getBatchInstruction,
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

export class Rendering {
  private _devtool: typeof PixiDevtools;
  private _textureCache: Map<TextureSource, RenderingTextureDataState> = new Map();

  private _glDrawFn!: GlGeometrySystem['draw'];
  private _drawOrder: { pipe: string; drawCalls: number }[] = [];
  private _pipeExecuteFn: Map<string, InstructionPipe<any>['execute']> = new Map();

  private _capturing = false;
  private _currentPipe: string | null = null;
  private _withScreenshot = false;
  private _canvasTextures: string[] = [];

  private _rebuilt = false;

  private stats = new Stats();

  constructor(devtool: typeof PixiDevtools) {
    this._devtool = devtool;
  }

  public init() {
    this._textureCache.clear();
    this.stats.reset();

    this._capturing = false;
    this._currentPipe = null;
    this._canvasTextures = [];

    // override the draw function to keep track of draw calls
    const renderer = this._devtool.renderer as WebGLRenderer;
    this._glDrawFn = renderer.geometry.draw;
    const gl = renderer.gl;
    renderer.geometry.draw = (...args) => {
      if (this._capturing) {
        if (this._currentPipe) {
          const pipe = this._drawOrder.at(-1);
          if (pipe) {
            pipe.drawCalls++;
          }
        }
      }

      const res = this._glDrawFn.apply(renderer.geometry, args);
      this.stats.drawCalls++;

      if (!this._capturing) return res;
      if (!this._withScreenshot) return res;

      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      readGlPixels(gl, renderer, this._canvasTextures, width, height);
      return res;
    };

    const batcherBuildStartFn = renderer.renderPipes.batch.buildStart;
    renderer.renderPipes.batch.buildStart = (...args) => {
      const res = batcherBuildStartFn.apply(renderer.renderPipes.batch, args);
      this._rebuilt = true;

      return res;
    };
  }
  public update() {
    this.stats.drawCalls = 0;
    this.stats.update();
  }
  public complete() {}

  public captureCanvasData(): RenderingState['canvasData'] {
    const renderer = this._devtool.renderer as WebGLRenderer;
    const canvas = renderer.view.canvas as HTMLCanvasElement;
    const options = renderer['_initOptions'];
    const contextAttributes = renderer.gl.getContextAttributes()!;

    const type = renderer.type === 0b10 ? 'webgpu' : renderer.context.webGLVersion === 1 ? 'webgl' : 'webgl2';

    return {
      type,
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
      powerPreference: contextAttributes.powerPreference as 'default' | 'high-performance' | 'low-power',
      preserveDrawingBuffer: options.preserveDrawingBuffer.toString(),
      premultipliedAlpha: options.premultipliedAlpha.toString(),
      resolution: renderer.resolution.toString(),
      roundPixels: renderer.roundPixels.toString(),
      failIfMajorPerformanceCaveat: contextAttributes.failIfMajorPerformanceCaveat?.toString(),

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
      renderTime: this._getRenderTime(renderer as WebGLRenderer),
    };

    const canvasTextures = this._capture(renderer as WebGLRenderer, withScreenshot);
    const sceneData = this._getSceneData(lastObjectRendered);
    const instructionData = this._getInstructionsData(instructionSet, canvasTextures, this._drawOrder);
    frameCaptureData.drawCalls = canvasTextures.length;
    frameCaptureData.instructions = instructionData;
    frameCaptureData.totals = sceneData;

    console.log(instructionSet.instructions.slice(0, instructionSet.instructionSize));
    console.log(frameCaptureData.instructions);

    return frameCaptureData;
  }

  private _capture(renderer: WebGLRenderer, withScreenshot: boolean) {
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

  private _postCapture(renderer: WebGLRenderer) {
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

  private _getRenderTime(renderer: WebGLRenderer) {
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
  ) {
    const instructionData: FrameCaptureData['instructions'] = [];
    let drawTotal = 0;
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
        | NineSliceInstruction = {} as any;

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
          break;
        default:
          data = {
            type: instruction.renderPipeId as any,
            action: instruction.action ?? 'unknown',
          } as BaseInstruction;
          break;
      }

      data.drawCalls = drawOrder[i].drawCalls;
      drawTotal += data.drawCalls;
      data.drawTextures = canvasTextures.slice(drawTotal - data.drawCalls, drawTotal);

      instructionData.push(data);
    }

    return instructionData;
  }
}
