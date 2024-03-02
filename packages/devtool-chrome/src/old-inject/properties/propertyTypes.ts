import { BasePropertyProps } from '@lib/components/properties/BaseProperty';
import { PropertyProps } from '@lib/components/properties/Properties';
import type { Container } from 'pixi.js';

export type OmitValueChange<T extends BasePropertyProps> = Omit<T, 'value' | 'onChange'>;
export interface Prop {
  section: string;
  type: PropertyProps['type'];
  property: string;
  propertyProps: OmitValueChange<PropertyProps['propertyProps']>;
}

export interface PropertyPlugin<T extends Container = Container> {
  getValidProps: (container: T) => Prop[];
  props: Prop[];
  getPropKeys: () => string[];
  getPropValue: (container: T, prop: string) => { value: any; prop: string } | null;
  setPropValue: (container: T, prop: string, value: any) => void;
}
