import { Container } from 'pixi.js';

export interface NodeTrackerPlugin {
  trackNode: (container: Container, state: Record<string, number>) => boolean;
  getKeys: () => string[];
}
