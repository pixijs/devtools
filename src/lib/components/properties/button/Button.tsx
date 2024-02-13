import React from 'react';
import styled from 'styled-components';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';

export interface ButtonProps extends BasePropertyProps {
  value: number;
  onChange: () => void;
}

export const StyledButtonRoot = styled.button`
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
  transition:
    box-shadow 0.2s,
    color 0.2s;

  &:hover {
    box-shadow: 0 0 0 1px var(--secondary-color);
    color: white;
  }

  &:active {
    background-color: var(--secondary-color);
    color: white;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const ButtonInput: React.FC<ButtonProps> = ({ value, onChange, label }) => {
  return (
    <BaseProperty label={label}>
      <StyledButtonRoot value={value} onClick={() => onChange()}>
        {label}
      </StyledButtonRoot>
    </BaseProperty>
  );
};
