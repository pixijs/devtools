import styled from 'styled-components';
import { SectionContainer } from '../Container';

export const TreeWrapper = styled(SectionContainer)`
  width: 100%;
  height: 100%;
  min-width: 50%;
`;

export const TreeDirectory = styled.div`
  font-size: 14px;
  color: var(--text);
  user-select: none;
  padding: 20px 0 0 12px;

  .tree,
  .tree-node,
  .tree-node-group {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tree-branch-wrapper,
  .tree-node__leaf {
    outline: none;
  }

  .tree-node {
    cursor: pointer;
  }

  .tree-node:hover {
    background: rgb(255 255 255 / 10%);
  }

  .tree .tree-node--focused {
    background: rgb(255 255 255 / 20%);
  }

  .tree .tree-node--selected {
    background: rgb(231 34 100 / 20%);
  }

  .tree-node__branch {
    display: block;
  }

  .icon {
    vertical-align: middle;
    padding-right: 5px;
  }

  .container.open {
    color: var(--primary-color);
    font-weight: bold;

    /* or use text-shadow for a bolder effect */
    text-shadow: 0 0 1px black;
  }

  .container.closed {
    color: var(--active-color);
    font-weight: bold;

    /* or use text-shadow for a bolder effect */
    text-shadow: 0 0 1px black;
  }
`;
