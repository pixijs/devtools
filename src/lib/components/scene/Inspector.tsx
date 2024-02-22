import React, { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropertiesComponent from '../properties/Properties';
import ScrollComponent from '../scroll/Scroll';
import TreeViewComponent from '../tree/TreeView';

const InspectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: ${({ theme }) => theme.inspectorHeight};
  max-height: ${({ theme }) => theme.inspectorHeight};
`;

const MemoizedPropertiesComponent = memo(PropertiesComponent);
const MemoizedTreeViewComponent = memo(TreeViewComponent);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InspectorProps {}
export const Inspector: React.FC<InspectorProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [remainingHeight, setRemainingHeight] = React.useState<number>(0);

  useEffect(() => {
    const calculateRemainingHeight = () => {
      if (ref.current) {
        const offsetTop = ref.current.offsetTop;
        const viewportHeight = window.innerHeight;
        const remainingHeight = viewportHeight - offsetTop;
        setRemainingHeight(remainingHeight);
      }
    };

    calculateRemainingHeight(); // Calculate initial height

    window.addEventListener('resize', calculateRemainingHeight); // Recalculate height when window is resized

    return () => {
      // Cleanup - remove the event listener when the component is unmounted
      window.removeEventListener('resize', calculateRemainingHeight);
    };
  }, []);

  return (
    <InspectorWrapper ref={ref} theme={{ inspectorHeight: `${remainingHeight}px` }}>
      <ScrollComponent>
        <MemoizedTreeViewComponent />
      </ScrollComponent>
      <ScrollComponent>
        <MemoizedPropertiesComponent />
      </ScrollComponent>
    </InspectorWrapper>
  );
};
