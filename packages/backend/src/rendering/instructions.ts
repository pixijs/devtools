import type {
  BatchInstruction,
  FilterInstruction,
  GraphicsInstruction,
  MaskInstruction,
  MeshInstruction,
  NineSliceInstruction,
  TilingSpriteInstruction,
} from '@devtool/frontend/pages/rendering/instructions/Instructions';
import type {
  Batch,
  BlurFilter,
  Filter,
  GlProgram,
  GpuProgram,
  Graphics,
  Mesh,
  NineSliceSprite,
  FilterInstruction as PixiFilterInstruction,
  Sprite,
  StencilMaskInstruction,
  TilingSprite,
  RenderContainer,
} from 'pixi.js';
import { getRenderableData, getStateData, getTextureData } from './renderableData';
import { PixiDevtools } from '../pixi';
import { getProgramSource } from './program';

type TextureCache = Parameters<typeof getTextureData>[1];
export function getBatchInstruction(instruction: Batch, textureCache: TextureCache): BatchInstruction {
  const textures: BatchInstruction['textures'] = [];
  instruction.textures.textures.forEach((texture) => {
    if (texture == null) return;
    const tex = getTextureData(texture, textureCache);
    if (tex) {
      textures.push(tex);
    } else {
      console.log('Texture not found', texture);
    }
  });

  return {
    type: 'batch',
    action: instruction.action,
    blendMode: instruction.blendMode,
    size: instruction.size,
    start: instruction.start,
    drawCalls: 0,
    drawTextures: [],
    textures,
  };
}

export function getCustomRenderableInstruction(instruction: RenderContainer, _textureCache: TextureCache) {
  return {
    type: 'customRender',
    action: 'custom',
    renderable: {
      ...getRenderableData(instruction),
    },
    drawCalls: 0,
    drawTextures: [],
  };
}

export function getGraphicsInstruction(instruction: Graphics, _textureCache: TextureCache): GraphicsInstruction {
  return {
    type: 'graphics',
    action: 'draw',
    renderable: {
      ...getRenderableData(instruction),
    },
    drawCalls: 0,
    drawTextures: [],
  };
}

export function getNineSliceInstruction(
  instruction: NineSliceSprite,
  textureCache: TextureCache,
): NineSliceInstruction {
  return {
    type: 'nineSlice',
    action: 'draw',
    renderable: {
      topHeight: instruction.topHeight,
      bottomHeight: instruction.bottomHeight,
      leftWidth: instruction.leftWidth,
      rightWidth: instruction.rightWidth,
      texture: instruction.texture ? getTextureData(instruction.texture._source, textureCache) : null,
      originalWidth: instruction.originalWidth,
      originalHeight: instruction.originalHeight,
      ...getRenderableData(instruction),
    },
    drawCalls: 0,
    drawTextures: [],
  };
}

export function getMaskInstruction(instruction: StencilMaskInstruction, _textureCache: TextureCache): MaskInstruction {
  const mask = instruction.mask?.mask;
  return {
    type: instruction.renderPipeId,
    action: instruction.action,
    mask: mask
      ? {
          ...getRenderableData(mask),
        }
      : null,
    drawCalls: 0,
    drawTextures: [],
  };
}

export function getFilterInstruction(
  instruction: PixiFilterInstruction,
  textureCache: TextureCache,
): FilterInstruction {
  const rendererType = PixiDevtools.renderer.name === 'webgl' ? 'webgl' : 'webgpu';
  const getProgramSource = (filter: Filter, shader: 'fragment' | 'vertex'): string => {
    const type = rendererType === 'webgl' ? 'glProgram' : 'gpuProgram';
    let program: GlProgram | GpuProgram;

    // if blur filter then you need to get the blurX/blurY shaders
    if ((filter as BlurFilter).blurXFilter) {
      program = (filter as BlurFilter).blurXFilter[type];
    } else {
      program = filter[type];
    }

    if (!program) {
      return '';
    }

    const source = program[shader];

    if (!source) {
      return '';
    }

    if (typeof source === 'string') {
      return source;
    }

    return source.source;
  };

  return {
    type: 'filter',
    action: instruction.action,
    filter: instruction.filterEffect?.filters?.map((filter) => {
      return {
        type: filter.constructor.name,
        padding: filter.padding,
        resolution: filter.resolution,
        antialias: filter.antialias,
        blendMode: filter.blendMode,
        program: {
          fragment: getProgramSource(filter, 'fragment'),
          vertex: getProgramSource(filter, 'vertex'),
        },
        state: getStateData(filter._state),
      };
    }),
    renderables:
      instruction.renderables?.map((renderable) => ({
        texture: (renderable as Sprite).texture
          ? getTextureData((renderable as Sprite).texture.source, textureCache)
          : null,
        ...getRenderableData(renderable),
      })) || ([] as FilterInstruction['renderables']),
    drawCalls: 0,
    drawTextures: [],
  };
}

interface PixiMeshObjectInstruction {
  renderPipeId: string;
  mesh: Mesh;
}

export function getMeshInstruction(
  instruction: Mesh | PixiMeshObjectInstruction,
  textureCache: TextureCache,
): MeshInstruction {
  const mesh = (instruction as PixiMeshObjectInstruction)?.mesh || instruction;
  const rendererType = PixiDevtools.renderer.name === 'webgl' ? 'webgl' : 'webgpu';
  let shader = mesh.shader;
  const program = {
    fragment: null as string | null,
    vertex: null as string | null,
  };

  if (!shader) {
    shader = PixiDevtools.renderer.renderPipes.mesh['_adaptor']._shader;
    program.fragment = getProgramSource(shader, 'fragment', rendererType);
    program.vertex = getProgramSource(shader, 'vertex', rendererType);
  } else {
    program.fragment = getProgramSource(shader, 'fragment', rendererType);
    program.vertex = getProgramSource(shader, 'vertex', rendererType);
  }
  return {
    type: 'mesh',
    action: 'draw',
    renderable: {
      texture: mesh.texture ? getTextureData(mesh.texture.source, textureCache) : null,
      program,
      state: getStateData(mesh.state),
      geometry: {
        indices: Array.from(mesh.geometry.indices),
        positions: Array.from(mesh.geometry.positions),
        uvs: Array.from(mesh.geometry.uvs),
      },
      ...getRenderableData(mesh),
    },
    drawCalls: 0,
    drawTextures: [],
  };
}

export function getTileSpriteInstruction(
  tilingSprite: TilingSprite,
  textureCache: TextureCache,
): TilingSpriteInstruction {
  return {
    type: 'tilingSprite',
    action: 'draw',
    renderable: {
      ...getRenderableData(tilingSprite),
      texture: tilingSprite.texture ? getTextureData(tilingSprite.texture.source, textureCache) : null,
      tilePosition: {
        x: tilingSprite.tilePosition.x,
        y: tilingSprite.tilePosition.y,
      },
      tileScale: {
        x: tilingSprite.tileScale.x,
        y: tilingSprite.tileScale.y,
      },
      tileRotation: tilingSprite.tileRotation,
      clampMargin: tilingSprite.clampMargin,
    },
    drawCalls: 0,
    drawTextures: [],
  };
}
