import type { PropertyPanelData } from '@devtool/frontend/pages/scene/scene-tree/Properties';
import type { Container, Renderer, Application } from 'pixi.js';

export interface NodeTrackerPlugin {
  trackNode: (container: Container, state: Record<string, number>) => boolean;
  getKeys: () => string[];
}

type NoOnChange = Omit<PropertyPanelData['entry'], 'onChange'>;
export type Props = Omit<PropertyPanelData, 'entry'> & { entry: NoOnChange };
export type PropsData = Omit<PropertyPanelData, 'entry'> & { entry: NoOnChange };

export interface PropertyPlugin {
  updateProps(container: Container): PropsData[];
  setValue(container: Container, prop: string, value: any): void;
  props: Props[];
}

export interface Devtools {
  app: Application;
  pixi?: typeof import('pixi.js');
  stage?: Container;
  renderer?: Renderer;
  plugins?: {
    stats?: NodeTrackerPlugin[];
    properties?: PropertyPlugin[];
  };
}
