import { PropertyPlugin } from '@pixi/devtools';
import type { Container, Rectangle } from 'pixi.js';

export const ContainerPropertiesPlugin: PropertyPlugin = {
  updateProps(container: Container) {
    this.props.forEach((property) => {
      const prop = property.prop as keyof Container | string;
      const value = container[prop as keyof Container] as any;

      if (prop === 'type') {
        property.value = container.constructor.name;
      } else if (value != null && (prop === 'position' || prop === 'scale' || prop === 'pivot' || prop === 'skew')) {
        property.value = [value.x, value.y];
      } else if (
        value != null &&
        (prop === 'filterArea' || prop === 'boundsArea' || prop === 'cullArea' || prop === 'hitArea')
      ) {
        property.value = [value.x, value.y, value.width, value.height];
      } else if (value != null && prop === 'worldTransform') {
        property.value = value.toArray();
      } else {
        property.value = value;
      }
    });

    return this.props;
  },
  containsProperty(prop: string) {
    return this.props.some((property) => property.prop === prop || property.prop === 'type');
  },
  setValue(container: Container, prop: string, value: any) {
    prop = prop as keyof Container;
    if (prop === 'position' || prop === 'scale' || prop === 'pivot' || prop === 'skew') {
      container.x = value[0];
      container.y = value[1];
    } else if (prop === 'filterArea' || prop === 'boundsArea' || prop === 'cullArea' || prop === 'hitArea') {
      (container[prop] as Rectangle)!.x = value[0];
      (container[prop] as Rectangle)!.y = value[1];
      (container[prop] as Rectangle)!.width = value[2];
      (container[prop] as Rectangle)!.height = value[3];
    } else if (prop === 'worldTransform') {
      container[prop].fromArray(value);
    } else {
      (container as any)[prop] = value;
    }
  },
  props: [
    { value: null, prop: 'type', entry: { section: 'Info', options: { disabled: true }, type: 'text' } }, // not editable
    { value: null, prop: 'label', entry: { section: 'Info', type: 'text' } },
    {
      value: null,
      prop: 'position',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    { value: null, prop: 'width', entry: { section: 'Transform', type: 'number' } },
    { value: null, prop: 'height', entry: { section: 'Transform', type: 'number' } },
    {
      value: null,
      prop: 'scale',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    { value: null, prop: 'rotation', entry: { section: 'Transform', type: 'number' } },
    { value: null, prop: 'angle', entry: { section: 'Transform', type: 'number' } },
    {
      value: null,
      prop: 'pivot',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    {
      value: null,
      prop: 'skew',
      entry: { section: 'Transform', options: { x: { label: 'x' }, y: { label: 'y' } }, type: 'vector2' },
    },
    // { section: 'Transform', value: null, prop: 'worldTransform', propertyProps: { label: 'World Transform' }, type: 'matrix' },
    { value: null, prop: 'visible', entry: { section: 'Appearance', type: 'boolean' } },
    { value: null, prop: 'renderable', entry: { section: 'Appearance', type: 'boolean' } },
    {
      value: null,
      prop: 'alpha',
      entry: { section: 'Appearance', options: { min: 0, max: 1, step: 0.05 }, type: 'range' },
    },
    { value: null, prop: 'tint', entry: { section: 'Appearance', type: 'color' } },
    // { value: null, prop: 'blendMode', section: 'Appearance', propertyProps: { label: 'Blend Mode' }, type: 'select' },
    {
      value: null,
      prop: 'filterArea',
      entry: {
        section: 'Rendering',
        options: { inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }] },
        type: 'vectorX',
      },
    },
    // // { propertyProps: { label: 'Filters' }, value: null, prop: 'filters', type: 'select' },
    {
      value: null,
      prop: 'boundsArea',
      entry: {
        section: 'Rendering',
        options: {
          inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
        },
        type: 'vectorX',
      },
    },
    { value: null, prop: 'isRenderGroup', entry: { section: 'Rendering', type: 'boolean' } },

    { value: null, prop: 'cullable', entry: { section: 'Culling', type: 'boolean' } },
    {
      value: null,
      prop: 'cullArea',
      entry: {
        section: 'Culling',
        options: {
          inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
        },
        type: 'vectorX',
      },
    },
    { value: null, prop: 'cullableChildren', entry: { section: 'Culling', type: 'boolean' } },

    { value: null, prop: 'sortableChildren', entry: { section: 'Sorting', type: 'boolean' } },
    { value: null, prop: 'zIndex', entry: { section: 'Sorting', type: 'number' } },

    { value: null, prop: 'interactive', entry: { section: 'Interaction', type: 'boolean' } },
    { value: null, prop: 'interactiveChildren', entry: { section: 'Interaction', type: 'boolean' } },
    {
      value: null,
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
      value: null,
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
      value: null,
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
