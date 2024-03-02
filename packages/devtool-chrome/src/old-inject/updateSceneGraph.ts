import { Container } from 'pixi.js';
import { PixiState, getPixiWrapper } from './devtool';
import { getPixiType } from './utils/getPixiType';

const uidMap = new WeakMap<Container, string>();
// todo: maybe reset when disconnected
let uid = 0;
function getId(container: Container): string {
  const existing = uidMap.get(container);

  if (existing) {
    return existing;
  }

  const res = `${uid++}_${(Math.random() + 1).toString(36).substring(2)}`;
  uidMap.set(container, res);

  return res;
}

export const sceneGraphMap: Map<Container, PixiState['sceneGraph']> = new Map();
export function updateSceneGraph(container: Container, parent: Container): void {
  const pixiWrapper = getPixiWrapper();
  const graph = pixiWrapper.state().sceneGraph;

  const type = getPixiType(container);

  if (container === pixiWrapper.stage()) {
    graph.children = [];
    graph.children.push({
      name: `${container.label ?? container.name ?? container.constructor.name} (stage)`,
      metadata: {
        type,
        uid: getId(container),
        isStage: true,
      },
      children: [],
    });
    sceneGraphMap.set(container, graph.children[0] as PixiState['sceneGraph']);
  } else {
    const parentGraph = sceneGraphMap.get(parent)!;
    const name = container.label ?? container.name;
    const nameIsType = name === type;
    let finalName: string;

    if (nameIsType) {
      finalName = `${name}`;
    } else {
      if (name) {
        finalName = `${name} (${type})`;
      } else {
        finalName = `${type}`;
      }
    }
    const node = {
      name: finalName,
      metadata: {
        type: type,
        uid: getId(container),
      },
      children: [],
    } as PixiState['sceneGraph'];
    parentGraph.children!.push(node);
    sceneGraphMap.set(container, node);
  }
}
