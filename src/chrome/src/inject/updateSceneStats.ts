import type { Container, Text } from 'pixi.js';
import { getPixiType } from './utils/getPixiType';
import { PixiState, getPixiWrapper } from './devtool';

enum RenderMode {
  Bitmap = 'bitmap',
  Html = 'html',
}

function updateSceneStatsForText(container: Text, state: PixiState) {
  const renderMode = container['_renderMode'];
  if (renderMode) {
    if (renderMode === RenderMode.Bitmap) {
      state.sceneStats.bitmapText += 1;
    } else if (renderMode === RenderMode.Html) {
      state.sceneStats.htmlText += 1;
    } else {
      state.sceneStats.text += 1;
    }

    return;
  }

  state.sceneStats.text += 1;
}

export function updateSceneStats(container: Container) {
  const pixiWrapper = getPixiWrapper();
  const state = pixiWrapper.state();

  state.sceneStats.totalSceneObjects += 1;

  const type = getPixiType(container);

  if (type === 'BitmapText') {
    state.sceneStats.bitmapText += 1;
  } else if (type === 'HTMLText') {
    state.sceneStats.htmlText += 1;
  } else if (type === 'Text') {
    updateSceneStatsForText(container as Text, state);
  } else if (type === 'Mesh') {
    state.sceneStats.mesh += 1;
  } else if (type === 'Graphics') {
    state.sceneStats.graphics += 1;
  } else if (type === 'Sprite') {
    state.sceneStats.sprite += 1;
  } else if (type === 'Container') {
    state.sceneStats.container += 1;
  }
}
