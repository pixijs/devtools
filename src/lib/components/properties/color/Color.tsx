import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';
import { StyledButtonRoot } from '../button/Button';

export interface ColorProps extends BasePropertyProps {
  value: number;
  onChange: (color: string) => void;
}

const StyledColorRoot = styled.div`
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

export const ColorInput: React.FC<ColorProps> = ({ value, onChange, label, ...rest }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  // convert number ot hex
  const hexString = value.toString(16);

  const hex = `#${'000000'.substring(0, 6 - hexString.length) + hexString}`;

  return (
    <BaseProperty label={label}>
      {displayColorPicker ? (
        <StyledColorRoot>
          <div style={{ position: 'absolute', zIndex: '2' }}>
            <div
              style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
              onClick={handleClose}
            />
            <ChromePicker
              color={hex}
              onChange={(updatedColor) => onChange(JSON.stringify(updatedColor.hex))}
              {...rest}
            />
          </div>
        </StyledColorRoot>
      ) : (
        <StyledButtonRoot onClick={handleClick}>{hex}</StyledButtonRoot>
      )}
    </BaseProperty>
  );
};
