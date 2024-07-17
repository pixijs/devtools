import type { SliderProps } from '@radix-ui/react-slider';
import type { SwitchProps } from '@radix-ui/react-switch';
import { memo } from 'react';
import { isDifferent } from '../../lib/utils';
import type { ColorProps } from '../ui/color';
import type { InputProps } from '../ui/input';
import type { Vector2Props, VectorXProps } from '../ui/vector2';
import { BooleanProperty } from './boolean-property';
import type { ButtonFnProps } from './button-property';
import { ButtonProperty } from './button-property';
import { ColorProperty } from './color-property';
import { NumberProperty } from './number-property';
import { RangeProperty } from './range-property';
import { SelectProperty } from './select-property';
import { TextProperty } from './text-property';
import { Vector2Property, VectorXProperty } from './vector-property';
import { MultiProperty } from './multi-property';

export type PropertyTypes =
  | 'boolean'
  | 'number'
  | 'range'
  | 'select'
  | 'text'
  | 'button'
  | 'vector2'
  | 'vectorX'
  | 'color'
  | 'multi';

export type SelectionProps = { options: string[] };

export type PropertyOptions =
  | InputProps
  | SwitchProps
  | Vector2Props
  | SliderProps
  | SelectionProps
  | VectorXProps
  | ColorProps
  | ButtonFnProps;

export type PropertyPanelData = {
  value: any;
  prop: string;
  entry: {
    section: string;
    tooltip?: string;
    label?: string;
    type: PropertyTypes;
    options?: PropertyOptions;
    onChange: (value: string | number | boolean) => void;
  };
};

const memoTest = (props: any, nextProps: any) => {
  return !isDifferent(props, nextProps);
};

export const propertyMap: Record<PropertyTypes, React.FC<PropertyPanelData>> = {
  boolean: memo(BooleanProperty, memoTest),
  number: memo(NumberProperty, memoTest),
  vector2: memo(Vector2Property, memoTest),
  range: memo(RangeProperty, memoTest),
  select: memo(SelectProperty, memoTest),
  text: memo(TextProperty, memoTest),
  button: memo(ButtonProperty, memoTest),
  vectorX: memo(VectorXProperty, memoTest),
  color: memo(ColorProperty, memoTest),
  multi: memo(MultiProperty, memoTest),
};
