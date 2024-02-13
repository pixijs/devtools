import { Container, Matrix, ObservablePoint, Point, Rectangle } from 'pixi.js';
import { PropertyPlugin } from './propertyTypes';
import { SliderProps } from '@lib/components/properties/slider/Slider';
import { getPixiWrapper } from '../devtool';
import { Vector2Props } from '@lib/components/properties/number/Vector2';
import { TextProps } from '@lib/components/properties/text/Text';
import { SelectProps } from '@lib/components/properties/select/Select';
import { VectorXProps } from '@lib/components/properties/number/VectorX';

export const ContainerPropsPlugin: PropertyPlugin = {
  getPropValue: function (container, prop) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }
    const pixi = getPixiWrapper().pixi();
    const value = container[prop as keyof Container];

    if (prop === 'type') {
      return { value: container.constructor.name, prop };
    }

    if (value instanceof pixi.Matrix) {
      return { value: value.toArray(), prop };
    } else if (value instanceof pixi.Point) {
      return { value: [value.x, value.y], prop };
    } else if (value instanceof pixi.ObservablePoint) {
      return { value: [value.x, value.y], prop };
    } else if (value instanceof pixi.Rectangle) {
      return { value: [value.x, value.y, value.width, value.height], prop };
    }

    return { value: container[prop as keyof Container], prop };
  },
  setPropValue: function (container, prop, value) {
    if (this.getPropKeys().indexOf(prop) === -1) {
      return null;
    }
    const pixi = getPixiWrapper().pixi();

    console.log('Setting prop', prop, value);

    if (container[prop as keyof Container] instanceof pixi.Matrix) {
      (container[prop as keyof Container] as Matrix).fromArray(value);
    } else if (container[prop as keyof Container] instanceof pixi.Point) {
      (container[prop as keyof Container] as Point).set(value[0], value[1]);
    } else if (container[prop as keyof Container] instanceof pixi.ObservablePoint) {
      (container[prop as keyof Container] as ObservablePoint).set(value[0], value[1]);
    } else if (container[prop as keyof Container] instanceof pixi.Rectangle) {
      const rect = container[prop as keyof Container] as Rectangle;
      rect.x = value[0];
      rect.y = value[1];
      rect.width = value[2];
      rect.height = value[3];
    } else {
      (container as any)[prop] = value;
    }
  },

  getValidProps: function (container) {
    return this.props.filter((prop) => {
      if (prop.property === 'type') return true;
      return container[prop.property as keyof Container] != undefined;
    });
  },
  props: [
    { property: 'type', section: 'Info', propertyProps: { label: 'Type', disabled: true } as TextProps, type: 'text' }, // not editable
    { property: 'label', section: 'Info', propertyProps: { label: 'Label' }, type: 'text' },
    {
      section: 'Transform',
      property: 'position',
      propertyProps: { label: 'Position', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
    { section: 'Transform', property: 'width', propertyProps: { label: 'Width' }, type: 'number' },
    { section: 'Transform', property: 'height', propertyProps: { label: 'Height' }, type: 'number' },
    {
      section: 'Transform',
      property: 'scale',
      propertyProps: { label: 'Scale', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
    { section: 'Transform', property: 'rotation', propertyProps: { label: 'Rotation' }, type: 'number' },
    { section: 'Transform', property: 'angle', propertyProps: { label: 'Angle' }, type: 'number' },
    {
      section: 'Transform',
      property: 'pivot',
      propertyProps: { label: 'Pivot', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
    {
      section: 'Transform',
      property: 'skew',
      propertyProps: { label: 'Skew', x: { label: 'x' }, y: { label: 'y' } } as Vector2Props,
      type: 'vector2',
    },
    // { section: 'Transform', property: 'worldTransform', propertyProps: { label: 'World Transform' }, type: 'matrix' },
    { property: 'visible', section: 'Appearance', propertyProps: { label: 'Visible' }, type: 'boolean' },
    { property: 'renderable', section: 'Appearance', propertyProps: { label: 'Renderable' }, type: 'boolean' },
    {
      property: 'alpha',
      section: 'Appearance',
      propertyProps: {
        label: 'Alpha',
        min: 0,
        max: 1,
        step: 0.05,
      } as SliderProps,
      type: 'range',
    },
    // { property: 'tint', section: 'Appearance', propertyProps: { label: 'Tint' }, type: 'color' },
    // { property: 'blendMode', section: 'Appearance', propertyProps: { label: 'Blend Mode' }, type: 'select' },
    {
      section: 'Rendering',
      property: 'filterArea',
      propertyProps: {
        label: 'Filter Area',
        inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
      } as VectorXProps,
      type: 'vectorX',
    },
    // // { propertyProps: { label: 'Filters' }, property: 'filters', type: 'select' },
    {
      section: 'Rendering',
      property: 'boundsArea',
      propertyProps: {
        label: 'Bounds Area',
        inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
      } as VectorXProps,
      type: 'vectorX',
    },
    {
      section: 'Rendering',
      property: 'isRenderGroup',
      propertyProps: { label: 'Is Render Group' },
      type: 'boolean',
    },

    {
      section: 'Culling',
      property: 'cullable',
      propertyProps: { label: 'Cullable' },
      type: 'boolean',
    },
    {
      section: 'Culling',
      property: 'cullArea',
      propertyProps: {
        label: 'Cull Area',
        inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
      } as VectorXProps,
      type: 'vectorX',
    },
    {
      section: 'Culling',
      property: 'cullableChildren',
      propertyProps: { label: 'Cullable Children' },
      type: 'boolean',
    },

    {
      section: 'Sorting',
      property: 'sortableChildren',
      propertyProps: { label: 'Sortable Children' },
      type: 'boolean',
    },
    { section: 'Sorting', property: 'zIndex', propertyProps: { label: 'Z Index' }, type: 'number' },

    { section: 'Interaction', property: 'interactive', propertyProps: { label: 'Interactive' }, type: 'boolean' },
    {
      section: 'Interaction',
      property: 'interactiveChildren',
      propertyProps: { label: 'Interactive Children' },
      type: 'boolean',
    },
    {
      section: 'Interaction',
      property: 'hitArea',
      propertyProps: {
        label: 'Hit Area',
        inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
      } as VectorXProps,
      type: 'vectorX',
    },
    {
      section: 'Interaction',
      property: 'eventMode',
      propertyProps: {
        label: 'Event Mode',
        options: ['none', 'passive', 'auto', 'static', 'dynamic'],
      } as SelectProps,
      type: 'select',
    },
    {
      section: 'Interaction',
      property: 'cursor',
      propertyProps: {
        label: 'Cursor',
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
      } as SelectProps,
      type: 'select',
    },
  ],
  getPropKeys: function () {
    return this.props.map((prop) => prop.property);
  },
};
