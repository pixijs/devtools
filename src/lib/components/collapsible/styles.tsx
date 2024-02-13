import styled from 'styled-components';
import * as Collapsible from '@radix-ui/react-collapsible';

export const CollapsibleRoot = styled(Collapsible.Root)`
  background-color: var(--header);
  width: calc(100%);
`;

export const CollapsibleTrigger = styled(Collapsible.Trigger)``;

export const CollapsibleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 14px;
  cursor: pointer;
  border-bottom: 1px solid var(--line);
  color: var(--text);
  font-size: 14px;
  font-weight: bold;

  &:hover {
    border-bottom: 1px solid var(--primary-color);
  }

  &[data-state='closed']:hover {
    border-bottom: 1px solid var(--secondary-color);
  }
`;

export const CollapsibleHeaderIcon = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  color: var(--text);
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const CollapsibleContent = styled(Collapsible.Content)<{ wrap?: 'wrap' | 'nowrap' }>`
  background-color: var(--bg);
  padding-top: 8px;
  display: flex;
  flex-wrap: ${({ wrap = 'wrap' }) => wrap};
  flex-direction: ${({ wrap = 'wrap' }) => (wrap === 'wrap' ? 'row' : 'column')};
`;
