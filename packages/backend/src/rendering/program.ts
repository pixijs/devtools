import type { Filter, TextureShader } from 'pixi.js';

export function getProgramSource(
  filter: Filter | TextureShader,
  shader: 'fragment' | 'vertex',
  rendererType: 'webgl' | 'webgpu',
): string {
  const type = rendererType === 'webgl' ? 'glProgram' : 'gpuProgram';
  const program = filter[type];
  const source = program[shader];

  if (!source) {
    return '';
  }

  if (typeof source === 'string') {
    return source;
  }

  return source.source;
}
