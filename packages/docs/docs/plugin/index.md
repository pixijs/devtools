---
sidebar_position: 0
---

# Getting Started

This guide will help you create your own extensions for the devtools.

:::warning
The devtools are still in development and the API may change in the future.

We are also still improving the documentation and adding more examples.
:::

## Extension Types

There are several types of extensions that you can create for the devtools that allow you to extend the functionality of the devtool:

- [Properties](properties.md) - Add properties to be displayed in the tree.
- [Overlay](overlay.md) - Highlight the bounds of a PixiJS object in the scene.
- [Stats](stats.md) - Track stats for a node in the scene.
- [Tree](tree.md) - Customise nodes in the tree.

## Adding an Extension

To add an extension to the devtools, you need to add it to the `extensions` array in the `devtools` options when you initialise the devtools.

```ts
import { initDevtools } from '@pixi/devtools';

initDevtools({
  ...
  extensions: [
    // Add your extension here
  ],
});
```

or adding it directly to the window:

```js
window.__PIXI_DEVTOOLS__ = {
  ...
  extensions: [
    // Add your extension here
  ],
};
```
:::note
At this time, the devtool does not support adding extensions after the devtool has been initialised.
:::
