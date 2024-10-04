import type { Container } from 'pixi.js';
import { PixiDevtools } from '../pixi';
import type { PixiNodeType } from '@pixi/devtools';

export function isBitmapText(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.BitmapText && container instanceof pixi.BitmapText;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'BitmapText') || '_activePagesMeshData' in container
  );
}

export function isHTMLText(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.HTMLText && container instanceof pixi.HTMLText;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'htmlText') ||
    ('_foreignObject' in container && '_svgRoot' in container)
  );
}

export function isText(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.Text && container instanceof pixi.Text;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'text') ||
    ('updateText' in container && 'drawLetterSpacing' in container && '_render' in container)
  );
}

export function isMesh(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.Mesh && container instanceof pixi.Mesh;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'mesh') ||
    ('_geometry' in container && 'drawMode' in container && 'vertexData' in container && 'batchUvs' in container)
  );
}

export function isGraphics(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.Graphics && container instanceof pixi.Graphics;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'graphics') ||
    ('drawRect' in container && 'drawPolygon' in container)
  );
}

export function isAnimatedSprite(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.AnimatedSprite && container instanceof pixi.AnimatedSprite;
  }
  return (
    'gotoAndPlay' in container && 'stop' in container && 'play' in container && '_isConnectedToTicker' in container
  );
}

export function isNineSliceSprite(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.NineSliceSprite && container instanceof pixi.NineSliceSprite;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'nineSliceSprite') ||
    ('_leftWidth' in container &&
      '_rightWidth' in container &&
      '_topHeight' in container &&
      '_bottomHeight' in container &&
      '_getMinScale' in container)
  );
}

export function isTilingSprite(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.TilingSprite && container instanceof pixi.TilingSprite;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'tilingSprite') ||
    ('tileTransform' in container && 'uvRespectAnchor' in container && 'uvMatrix' in container)
  );
}

export function isSprite(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.Sprite && container instanceof pixi.Sprite;
  }
  return (
    ('renderPipeId' in container && container['renderPipeId'] === 'sprite') ||
    ('vertexTrimmedData' in container && 'indices' in container)
  );
}

export function isContainer(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    return pixi.Container && container instanceof pixi.Container;
  }
  return (
    ('includeInBuild' in container && 'measurable' in container && '_didLocalTransformChangeId' in container) ||
    ('_maskRefCount' in container && '_render' in container && '_tempDisplayObjectParent' in container)
  );
}

export function isParticleContainer(container: Container, pixi?: (typeof PixiDevtools)['pixi']): boolean {
  if (pixi) {
    // @ts-expect-error - particle container is a unreleased 8.5 feature
    return pixi.ParticleContainer && container instanceof pixi.ParticleContainer;
  }
  return ('renderPipeId' in container && container['renderPipeId'] === 'particle') || 'particleChildren' in container;
}

export function getPixiType(container: Container): PixiNodeType {
  const pixi = PixiDevtools.pixi;

  if (isBitmapText(container, pixi)) {
    return 'BitmapText';
  } else if (isHTMLText(container, pixi)) {
    return 'HTMLText';
  } else if (isText(container, pixi)) {
    return 'Text';
  } else if (isMesh(container, pixi)) {
    return 'Mesh';
  } else if (isGraphics(container, pixi)) {
    return 'Graphics';
  } else if (isAnimatedSprite(container, pixi)) {
    return 'AnimatedSprite';
  } else if (isNineSliceSprite(container, pixi)) {
    return 'NineSliceSprite';
  } else if (isTilingSprite(container, pixi)) {
    return 'TilingSprite';
  } else if (isSprite(container, pixi)) {
    return 'Sprite';
  } else if (isParticleContainer(container, pixi)) {
    return 'ParticleContainer';
  } else if (isContainer(container, pixi)) {
    return 'Container';
  } else {
    return 'Unknown';
  }
}
