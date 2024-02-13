import * as Switch from '@radix-ui/react-switch';
import React from 'react';
import styled from 'styled-components';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';

export interface SwitchProps extends BasePropertyProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const StyledSwitchRoot = styled(Switch.Root)`
  width: 26px;
  height: 17px;
  background-color: var(--darkest-color);
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px black;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:focus {
    box-shadow: 0 0 0 2px black;
  }

  &[data-state='checked'] {
    background-color: var(--secondary-color);
  }
`;

const StyledSwitchThumb = styled(Switch.Thumb)`
  display: block;
  width: 15px;
  height: 15px;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 2px 2px black;
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;

  &[data-state='checked'] {
    transform: translateX(10px);
  }
`;

export const Switcher: React.FC<SwitchProps> = ({ value, onChange, label, disabled = false }) => {
  return (
    <BaseProperty label={label}>
      <StyledSwitchRoot checked={value} onCheckedChange={onChange} disabled={disabled}>
        <StyledSwitchThumb />
      </StyledSwitchRoot>
    </BaseProperty>
  );
};
