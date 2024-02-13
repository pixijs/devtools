import styled from 'styled-components';
import { BaseProperty, BasePropertyProps } from '../BaseProperty';
import { NumberInput, NumberProps } from './Number';

export interface VectorXProps extends BasePropertyProps {
  inputs: NumberProps[];
  onChange: (value: string) => void;
  value: number[];
}

const VectorXContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

export const VectorX: React.FC<VectorXProps> = ({ inputs, label, onChange, value }) => {
  inputs.forEach((vector, index) => {
    vector.onChange = (v: number) => {
      const newValue = [...value];
      newValue[index] = v;
      onChange(JSON.stringify(newValue));
    };

    vector.value = value[index];
  });

  return (
    <BaseProperty label={label}>
      <VectorXContainer>
        {inputs.map((vector, index) => (
          <NumberInput key={index} {...vector} />
        ))}
      </VectorXContainer>
    </BaseProperty>
  );
};
