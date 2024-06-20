import type { Properties } from '@pixi/devtools';

export const textProps = [
  { prop: 'text', entry: { section: 'Text', type: 'text' } },
  // { section: 'Text', property: 'style', propertyProps: { label: 'Style' }, type: 'text' },
  { prop: 'resolution', entry: { section: 'Text', type: 'number' } },
] as Properties[];
