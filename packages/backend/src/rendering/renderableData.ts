import type {
  RenderableData,
  RenderingTextureDataState,
  StateData,
} from '@devtool/frontend/pages/rendering/instructions/Instructions';
import type { Container, Sprite, State, TextureSource } from 'pixi.js';
import { getPixiType } from '../utils/getPixiType';
import { PixiDevtools } from '../pixi';

export function getTextureData(
  texture: TextureSource,
  textureCache: Map<TextureSource, RenderingTextureDataState>,
): RenderingTextureDataState {
  const devtool = PixiDevtools;
  if (!textureCache.has(texture)) {
    const tex = devtool.textures.getTextureSource(texture);
    const glTextures = devtool.textures.getWebTextures();
    const size = devtool.textures.getMemorySize(texture, glTextures[texture.uid]);
    if (tex) {
      textureCache.set(texture, {
        blob: tex,
        name: texture.label,
        gpuSize: size || 0,
        pixelWidth: texture.pixelWidth,
        pixelHeight: texture.pixelHeight,
      });
    }
  }

  return textureCache.get(texture)!;
}

export function getStateData(filter: State): StateData {
  return {
    blend: filter.blend,
    blendMode: filter.blendMode,
    clockwiseFrontFace: filter.clockwiseFrontFace,
    cullMode: filter.cullMode,
    culling: filter.culling,
    depthMask: filter.depthMask,
    depthTest: filter.depthTest,
    offsets: filter.offsets,
    polygonOffset: filter.polygonOffset,
  };
}

export function getRenderableData(container: Container | Sprite): RenderableData {
  return {
    class: container.constructor.name,
    type: getPixiType(container),
    label: container.label,
    position: {
      x: container.position.x,
      y: container.position.y,
    },
    width: container.width,
    height: container.height,
    scale: {
      x: container.scale.x,
      y: container.scale.y,
    },
    anchor: (container as Sprite).anchor
      ? {
          x: (container as Sprite).anchor.x,
          y: (container as Sprite).anchor.y,
        }
      : null,
    rotation: container.rotation,
    angle: container.angle,
    pivot: {
      x: container.pivot.x,
      y: container.pivot.y,
    },
    skew: {
      x: container.skew.x,
      y: container.skew.y,
    },
    visible: container.visible,
    renderable: container.renderable,
    alpha: container.alpha,
    tint: container.tint,
    blendMode: container.blendMode,
    roundPixels: (container as Sprite).roundPixels ?? false,
    filterArea: container.filterArea
      ? {
          x: container.filterArea.x,
          y: container.filterArea.y,
          width: container.filterArea.width,
          height: container.filterArea.height,
        }
      : null,
    isRenderGroup: container.isRenderGroup,
    sortableChildren: container.sortableChildren,
    zIndex: container.zIndex,
    boundsArea: container.boundsArea
      ? {
          x: container.boundsArea.x,
          y: container.boundsArea.y,
          width: container.boundsArea.width,
          height: container.boundsArea.height,
        }
      : null,
    cullable: container.cullable ?? false,
    cullArea: container.cullArea
      ? {
          x: container.cullArea.x,
          y: container.cullArea.y,
          width: container.cullArea.width,
          height: container.cullArea.height,
        }
      : null,
    cullableChildren: container.cullableChildren ?? false,
  };
}
