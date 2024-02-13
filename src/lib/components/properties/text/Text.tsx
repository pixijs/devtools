import React from 'react';
import styled from 'styled-components';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';

export interface TextProps extends BasePropertyProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
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

export const TextInput: React.FC<TextProps> = ({ value, onChange, label, ...rest }) => {
  return (
    <BaseProperty label={label}>
      <StyledNumberRoot
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange(JSON.stringify(event.target.value))}
        {...rest}
      />
    </BaseProperty>
  );
};
