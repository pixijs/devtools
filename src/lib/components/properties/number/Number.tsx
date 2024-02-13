import React from 'react';
import styled from 'styled-components';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';

export interface NumberProps extends BasePropertyProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const StyledNumberRoot = styled.input`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 10px;
  height: 24px;
  font-size: 10px;
  line-height: 1;
  color: var(--text);
  background-color: var(--darkest-color);
  box-shadow: 0 0 0 1px black;

  &:focus {
    box-shadow: 0 0 0 2px var(--secondary-color);
  }
  &::selection {
    background-color: var(--secondary-color);
    color: white;
  }
`;

export const NumberInput: React.FC<NumberProps> = ({ value, onChange, label, min, max, step }) => {
  return (
    <BaseProperty label={label}>
      <StyledNumberRoot
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </BaseProperty>
  );
};

NumberInput.defaultProps = {
  min: -Infinity,
  max: Infinity,
  step: 1,
};
