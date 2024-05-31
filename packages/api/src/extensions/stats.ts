import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

export interface StatsExtension {
  extension: ExtensionMetadata;
  trackNode: (container: Container, state: Record<string, number>) => boolean;
  getKeys: () => string[];
}
