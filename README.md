# PixiJS DevTools

<div align="center">

![Your Logo](.github/logo.svg 'PixiJS DevTools')

</div>

A chrome extension for debugging PixiJS applications.

# Features

This extension is currently in development and has reached only its first phase. In the next phase we will be adding more features to make it easier for developers to diagnose performance issues and visualize the resources that their applications are consuming. The main focus will be around displaying what assets have been loaded by the application.

For now the extension has the following features:

- Display what type of objects your scene is made up of, and how it changes over time.
- Display the display tree of the application.
- Ability to inspect and change the properties of objects in the scene.

## Installation

Installation is available from the chrome web store.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/todo.svg)](https://chrome.google.com/webstore/detail/pixijs-devtools/todo)

You can also download the latest release from the [releases page](https://github.com/pixijs/devtools/releases).

## Setup

To use the extension, you need to setup the devtool in your application. This is done by setting the `window.__PIXI_DEVTOOLS__` object to contain the `pixi` and `app` properties.
The `pixi` property should be the PixiJS library, and the `app` property should be the instance of the `Application` class.

```js
import * as PIXI from 'pixi.js';

window.__PIXI_DEVTOOLS__ = {
  pixi: PIXI,
  app: new Application(),
};
```

Alternatively you can install the `@pixi/devtools` package and use the `initDevtools` function to setup the devtool.

```js
import { initDevtools } from '@pixi/devtools';

initDevtools({
  app,
});
```
This package will automatically import `pixi.js` dynamically if you do not provide `pixi` in the configuration.

### Optional Configuration

You can also pass a configuration object to the `__PIXI_DEVTOOLS__` object. This object can contain the following properties:

- `stage` - The stage of the application. This is used to display the display tree.
- `renderer` - The renderer of the application. This is used to display the render information.
- `plugins` - An object containing different types of plugins that can be used to extend the functionality of the devtool.
  - `stats` - An array of stats plugins to allow you to track the number of any object type in the scene.
  - `properties` - An array of property plugins to allow you to display whatever properties you want in the scene panel.

```js
const app = new Application();
window.__PIXI_DEVTOOLS__ = {
    pixi: PIXI,
    app
    stage: app.stage
    renderer: app.renderer
    plugins: {
        stats: [],
        properties: []
    }
};
```

### Property Plugins

Property plugins are used to display custom properties in the scene panel. Below is an example of a property plugin that displays the `x` and `y` properties of a `Container` object.

```js
export const XYPlugin: PropertyPlugin = {
  updateProps(container: Container) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof Container | string;
      const value = container[prop as keyof Container] as any;

      property.value = [value.x, value.y];
    });

    return this.props;
  },
  containsProperty(prop: string) {
    return this.props.some((property) => property.prop === prop);
  },
  setValue(container: Container, prop: string, value: any) {
    prop = prop as keyof Container;
    container[prop].set(value[0], value[1]);
  },
  props: [
    {
      value: null,
      prop: 'position',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
  ],
};
```

## License

MIT License.
