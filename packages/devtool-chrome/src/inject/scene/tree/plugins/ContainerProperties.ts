import { PropertyPlugin, PropsData } from '@pixi/devtools';
import type { Container } from 'pixi.js';

export const ContainerPropertiesPlugin: PropertyPlugin = {
  getEntries(container: Container) {
    // loop through all the props and return the data plus the value
    const entries: (PropsData | null)[] = this.props.map((property) => {
      const prop = property.prop as keyof Container | string;
      let value = container[prop as keyof Container] as any;

      if (value == undefined) {
        return null;
      }

      if (prop === 'type') {
        value = container.constructor.name;
      } else if (prop === 'position' || prop === 'scale' || prop === 'pivot' || prop === 'skew') {
        value = [value.x, value.y];
      } else if (prop === 'filterArea' || prop === 'boundsArea' || prop === 'cullArea' || prop === 'hitArea') {
        value = [value.x, value.y, value.width, value.height];
      } else if (prop === 'matrix') {
        value = value.toArray();
      }

      return { entry: { ...property.entry }, value, prop };
    });

    return entries.filter((entry) => entry !== null) as PropsData[];
  },
  props: [
    { prop: 'type', entry: { section: 'Info', options: { disabled: true }, type: 'text' } }, // not editable
    { prop: 'label', entry: { section: 'Info', type: 'text' } },
    {
      prop: 'position',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    { prop: 'width', entry: { section: 'Transform', type: 'number' } },
    { prop: 'height', entry: { section: 'Transform', type: 'number' } },
    {
      prop: 'scale',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    { prop: 'rotation', entry: { section: 'Transform', type: 'number' } },
    { prop: 'angle', entry: { section: 'Transform', type: 'number' } },
    {
      prop: 'pivot',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    {
      prop: 'skew',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    // { section: 'Transform', prop: 'worldTransform', propertyProps: { label: 'World Transform' }, type: 'matrix' },
    { prop: 'visible', entry: { section: 'Appearance', type: 'boolean' } },
    { prop: 'renderable', entry: { section: 'Appearance', type: 'boolean' } },
    { prop: 'alpha', entry: { section: 'Appearance', options: { min: 0, max: 1, step: 0.05 }, type: 'range' } },
    { prop: 'tint', entry: { section: 'Appearance', type: 'color' } },
    // { prop: 'blendMode', section: 'Appearance', propertyProps: { label: 'Blend Mode' }, type: 'select' },
    {
      prop: 'filterArea',
      entry: {
        section: 'Rendering',
        options: { inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }] },
        type: 'vectorX',
      },
    },
    // // { propertyProps: { label: 'Filters' }, prop: 'filters', type: 'select' },
    {
      prop: 'boundsArea',
      entry: {
        section: 'Rendering',
        options: {
          inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
        },
        type: 'vectorX',
      },
    },
    { prop: 'isRenderGroup', entry: { section: 'Rendering', type: 'boolean' } },

    { prop: 'cullable', entry: { section: 'Culling', type: 'boolean' } },
    {
      prop: 'cullArea',
      entry: {
        section: 'Culling',
        options: {
          inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
        },
        type: 'vectorX',
      },
    },
    { prop: 'cullableChildren', entry: { section: 'Culling', type: 'boolean' } },

    { prop: 'sortableChildren', entry: { section: 'Sorting', type: 'boolean' } },
    { prop: 'zIndex', entry: { section: 'Sorting', type: 'number' } },

    { prop: 'interactive', entry: { section: 'Interaction', type: 'boolean' } },
    { prop: 'interactiveChildren', entry: { section: 'Interaction', type: 'boolean' } },
    {
      prop: 'hitArea',
      entry: {
        section: 'Interaction',
        options: {
          inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
        },
        type: 'vectorX',
      },
    },
    {
      prop: 'eventMode',
      entry: {
        section: 'Interaction',
        options: {
          options: ['none', 'passive', 'auto', 'static', 'dynamic'],
        },
        type: 'select',
      },
    },
    {
      prop: 'cursor',
      entry: {
        section: 'Interaction',
        options: {
          options: [
            'auto',
            'default',
            'none',
            'context-menu',
            'help',
            'pointer',
            'progress',
            'wait',
            'cell',
            'crosshair',
            'text',
            'vertical-text',
            'alias',
            'copy',
            'move',
            'no-drop',
            'not-allowed',
            'e-resize',
            'n-resize',
            'ne-resize',
            'nw-resize',
            's-resize',
            'se-resize',
            'sw-resize',
            'w-resize',
            'ns-resize',
            'ew-resize',
            'nesw-resize',
            'col-resize',
            'nwse-resize',
            'row-resize',
            'all-scroll',
            'zoom-in',
            'zoom-out',
            'grab',
            'grabbing',
          ],
        },
        type: 'select',
      },
    },
  ],
};
