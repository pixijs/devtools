import styled from 'styled-components';
import { Content as RTContent, List as RTList, Root as RTRoot, Trigger as RTTrigger } from '@radix-ui/react-tabs';

export const Root = styled(RTRoot)``;
export const List = styled(RTList)`
  background-color: var(--header);
  display: flex;
  justify-content: space-evenly;
`;
export const Trigger = styled(RTTrigger)`
  background-color: var(--header);
  color: var(--text);
  cursor: pointer;
  font-size: 1.2em;
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  text-align: center;
  border: 1px solid #3d3d3d;
  border-right-width: 1px;
  border-bottom-width: 1px;

  &:hover {
    border-bottom: 2px solid var(--primary-color);
  }

  &[data-state='active'] {
    border-bottom: 2px solid var(--primary-color);
    font-weight: bold;
  }

  &[data-state='inactive']:hover {
    opacity: 0.7;
    border-bottom: 1px solid var(--secondary-color);
  }

  &[data-disabled] {
    cursor: not-allowed;
  }
`;
export const Content = styled(RTContent)``;
