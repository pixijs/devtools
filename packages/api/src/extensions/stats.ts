import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from './ext';

export interface StatsExtension {
  extension: ExtensionMetadata;
  /**
   * Track some stats for a node.
   * This function is called on every node in the scene.
   * @param container The current node
   * @param state The current stats for the scene.
   */
  track: (container: Container, state: Record<string, number>) => void;
  /**
   * Get the keys of what ypu are tracking.
   * This is used to warn the user if the same key is being tracked by multiple extensions.
   */
  getKeys: () => string[];
}
