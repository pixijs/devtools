import React from 'react';
import PropertiesComponent from '../properties/Properties';
import TreeViewComponent from '../tree/TreeView';
import styled from 'styled-components';

const InspectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InspectorProps {}
export const Inspector: React.FC<InspectorProps> = () => {
  return (
    <InspectorWrapper>
      <TreeViewComponent />
      <PropertiesComponent />
    </InspectorWrapper>
  );
};
