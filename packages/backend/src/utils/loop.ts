import type { Container } from 'pixi.js';

interface LoopOptions {
  loop: (container: Container, parent: Container) => void;
  test?: (container: Container, parent: Container) => boolean | 'children';
  container: Container;
}

export function loop(options: LoopOptions) {
  const { container, ...rest } = options;

  loopRecursive(container, rest);
}

function loopRecursive(container: Container, opts: Omit<LoopOptions, 'container'>) {
  const { loop, test } = opts;

  const testResult = test?.(container, container.parent) ?? true;

  if (testResult === false) {
    return;
  }

  loop(container, container.parent);

  if (container.children.length === 0 || testResult === 'children') {
    return;
  }

  for (let i = 0; i < container.children.length; i++) {
    loopRecursive(container.children[i], opts);
  }
}
