import * as Label from '@radix-ui/react-label';
import React from 'react';
import styled from 'styled-components';

export interface BasePropertyProps {
  label: string;
  children?: React.ReactElement<BasePropertyProps>;
}

const Wrapper = styled.div`
  display: flex;
  padding: 2px 16px;
  gap: 8px;
  align-items: center;
`;

const StyledLabelRoot = styled(Label.Root)`
  font-size: 12px;
  font-weight: 500;
  line-height: 35px;
  color: var(--text);
`;

export const BaseProperty: React.FC<BasePropertyProps> = ({ label, children }) => {
  return (
    <Wrapper>
      <StyledLabelRoot>{label}:</StyledLabelRoot>
      {children}
    </Wrapper>
  );
};
