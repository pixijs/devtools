import type { Container } from 'pixi.js';

interface LoopOptions {
  test?: (container: Container) => boolean;
  loop: (container: Container, parent: Container) => void;
  container: Container;
}

export function loop(options: LoopOptions) {
  const { container, ...rest } = options;

  if (!rest.test) {
    rest.test = () => true;
  }

  loopRecursive(container, rest);
}

function loopRecursive(container: Container, opts: Omit<LoopOptions, 'container'>) {
  const { loop, test } = opts;

  if (!test?.(container)) {
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
