import * as Sliderer from '@radix-ui/react-slider';
import React from 'react';
import styled from 'styled-components';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';

export interface SliderProps extends BasePropertyProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const StyledSliderRoot = styled(Sliderer.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 200px;
  height: 20px;
`;

const StyledSliderTrack = styled(Sliderer.Track)`
  background-color: white;
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 3px;
`;

const StyledSliderThumb = styled(Sliderer.Thumb)`
  display: block;
  width: 15px;
  height: 15px;
  background-color: white;
  box-shadow: 0 2px 10px black;
  border-radius: 10px;

  &:hover {
    background-color: white;
  }
`;

const StyledSliderRange = styled(Sliderer.Range)`
  position: absolute;
  background-color: var(--secondary-color);
  border-radius: 9999px;
  height: 100%;
`;

export const Slider: React.FC<SliderProps> = ({ value, onChange, label, max, min, step }) => {
  return (
    <BaseProperty label={label}>
      <StyledSliderRoot value={[value]} onValueChange={(value) => onChange(value[0])} min={min} max={max} step={step}>
        <StyledSliderTrack>
          <StyledSliderRange />
        </StyledSliderTrack>
        <StyledSliderThumb aria-label="Volume" />
      </StyledSliderRoot>
    </BaseProperty>
  );
};
