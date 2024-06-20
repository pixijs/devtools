---
title: Stats
---
# Stats Extension

The stats extension allows you to provided valuable insights into the current scene by displaying various metrics, such as the number of specific nodes or any other data you wish to track. This tool enhances your ability to monitor and optimize your PixiJS application.

```ts
export interface StatsExtension {
  /**
   * The metadata for the extension.
   */
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
```

#### Example

```ts
import { Sprite } from 'pixi.js';
import type { Container } from 'pixi.js';
import type { ExtensionMetadata } from '@pixi-spine/devtools';

export const stats: StatsExtension = {
  extension: {
    type: 'stats',
    name: 'custom-stats',
  },
  track(container: Container, state: Record<string, number>) {
    if (container instanceof Sprite) {
      state.spriteCount = (state.spriteCount || 0) + 1;
    }
  },
  getKeys() {
    return ['spriteCount'];
  },
};
```
