import React from 'react';
import styled from 'styled-components';
import { NumberInput, NumberProps } from './Number';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';

export interface Vector2Props extends BasePropertyProps {
  x: NumberProps;
  y: NumberProps;
  onChange: (value: string) => void;
  value: [number, number];
}

const Vector2Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Vector2: React.FC<Vector2Props> = ({ x, y, label, onChange, value }) => {
  x.onChange = (value: number) => {
    console.log('x.onChange', value, y.value);
    onChange(JSON.stringify([value, y.value]));
  };
  y.onChange = (value: number) => {
    onChange(JSON.stringify([x.value, value]));
  };

  x.value = value[0];
  y.value = value[1];

  return (
    <BaseProperty label={label}>
      <Vector2Container>
        <NumberInput {...x} />
        <NumberInput {...y} />
      </Vector2Container>
    </BaseProperty>
  );
};
