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

You can also download the latest release from the [releases page](https://github.com/pixijs/dev-tools/releases).

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

### Optional Configuration

You can also pass a configuration object to the `__PIXI_DEVTOOLS__` object. This object can contain the following properties:

- `stage` - The stage of the application. This is used to display the display tree.
- `renderer` - The renderer of the application. This is used to display the render information.
- `scenePanel` - An object containing properties to be displayed in the scene panel.
  - `properties` - An array of property plugins to allow you to display whatever properties you want in the scene panel.

```js
const app = new Application();
window.__PIXI_DEVTOOLS__ = {
    pixi: PIXI,
    app
    stage: app.stage
    renderer: app.renderer
    scenePanel: {
        properties: []
    }
};
```

### Property Plugins

Property plugins are used to display custom properties in the scene panel. Below is an example of a property plugin that displays the `x` and `y` properties of a `Sprite` object.

```js
const XYPlugin: PropertyPlugin = {
  getPropValue: function (container: Container, prop: string) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }
    const pixi = window.__PIXI_DEVTOOLS_WRAPPER__.pixi();
    const value = container[prop as keyof Container];

    if (value instanceof pixi.ObservablePoint) {
      return { value: [value.x, value.y], prop };
    }

    return { value: container[prop as keyof Container], prop };
  },
  setPropValue: function (container: Container, prop: string, value: any) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }
    const pixi = window.__PIXI_DEVTOOLS_WRAPPER__.pixi();
    if (container[prop as keyof Container] instanceof pixi.ObservablePoint) {
      (container[prop as keyof Container] as ObservablePoint).set(value[0], value[1]);
    } else {
      (container as any)[prop] = value;
    }
  },
  getValidProps: function (container: Container) {
    return this.props.filter((prop) => {
      return container[prop.property as keyof Container] !== undefined;
    });
  },
  props: [
    {
      section: 'Transform',
      property: 'position',
      propertyProps: { label: 'Position', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
  ],
  getPropKeys: function () {
    return this.props.map((prop) => prop.property);
  },
};
```

## License

MIT License.
