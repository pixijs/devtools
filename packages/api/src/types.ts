import type { Container, Renderer, Application } from 'pixi.js';

type PropertyPanelData = {
  value: any;
  prop: string;
  entry: {
    section: string;
    label?: string;
    type: 'boolean' | 'number' | 'range' | 'select' | 'text' | 'button' | 'vector2' | 'vectorX' | 'color';
    options?: any;
    onChange: (value: string | number | boolean) => void;
  };
};

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
  containsProperty(prop: string): boolean;
  props: Props[];
}

interface DevtoolApp {
  app: Application;
}

interface DevtoolRenderer {
  renderer: Renderer;
  stage: Container;
}

interface DevtoolPixi {
  pixi?: typeof import('pixi.js');
  plugins?: {
    stats?: NodeTrackerPlugin[];
    properties?: PropertyPlugin[];
  };
}

export type DevtoolsAPI = (DevtoolApp | DevtoolRenderer) & DevtoolPixi;
export type Devtools = Partial<DevtoolApp & DevtoolRenderer & DevtoolPixi>;
