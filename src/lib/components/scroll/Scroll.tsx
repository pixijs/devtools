import React from 'react';
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from './styles';

interface ScrollProps {
  children?: React.ReactNode;
}
const ScrollComponent: React.FC<ScrollProps> = ({ children }) => {
  return (
    <ScrollAreaRoot className="ScrollAreaRoot">
      <ScrollAreaViewport className="ScrollAreaViewport">{children}</ScrollAreaViewport>
      <ScrollAreaScrollbar className="ScrollAreaScrollbar" orientation="vertical">
        <ScrollAreaThumb className="ScrollAreaThumb" />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar className="ScrollAreaScrollbar" orientation="horizontal">
        <ScrollAreaThumb className="ScrollAreaThumb" />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  );
};

export default ScrollComponent;
