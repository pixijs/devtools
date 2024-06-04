import type { Properties } from '@pixi/devtools';

export const sharedContainerProps = [
  { prop: 'type', entry: { section: 'Info', options: { disabled: true }, type: 'text' } }, // not editable
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
  {
    prop: 'worldTransform',
    entry: {
      section: 'Transform',
      options: {
        inputs: [
          { label: 'a', disabled: true },
          { label: 'b', disabled: true },
          { label: 'c', disabled: true },
          { label: 'd', disabled: true },
          { label: 'tx', disabled: true },
          { label: 'ty', disabled: true },
        ],
      },
      type: 'vectorX',
    },
  },
  { prop: 'visible', entry: { section: 'Appearance', type: 'boolean' } },
  { prop: 'renderable', entry: { section: 'Appearance', type: 'boolean' } },
  {
    prop: 'alpha',
    entry: { section: 'Appearance', options: { min: 0, max: 1, step: 0.05 }, type: 'range' },
  },
  { prop: 'tint', entry: { section: 'Appearance', type: 'color' } },
  {
    prop: 'filterArea',
    entry: {
      section: 'Rendering',
      options: { inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }] },
      type: 'vectorX',
    },
  },
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
] as Properties[];
