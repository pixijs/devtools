import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

export interface StatsExtension {
  extension: ExtensionMetadata;
  track: (container: Container, state: Record<string, number>) => void;
  getKeys: () => string[];
}
