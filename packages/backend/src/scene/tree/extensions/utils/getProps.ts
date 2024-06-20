import { PixiDevtools } from '../../../../pixi';

export function getProps<T, K>(v7: T, v8: K) {
  if (PixiDevtools.majorVersion === '7') {
    return v7;
  }

  return v8;
}
