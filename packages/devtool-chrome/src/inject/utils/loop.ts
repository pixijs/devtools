import type { Container } from 'pixi.js';

interface LoopOptions {
  loop: (container: Container, parent: Container) => void;
  test?: (container: Container, parent: Container) => boolean;
  container: Container;
}

export function loop(options: LoopOptions) {
  const { container, ...rest } = options;

  loopRecursive(container, rest);
}

function loopRecursive(container: Container, opts: Omit<LoopOptions, 'container'>) {
  const { loop, test } = opts;

  if (!test?.(container, container.parent)) {
    return;
  }


  loop(container, container.parent);

  if (container.children.length === 0) {
    return;
  }

  for (let i = 0; i < container.children.length; i++) {
    loopRecursive(container.children[i], opts);
  }
}
