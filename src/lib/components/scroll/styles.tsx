import styled from 'styled-components';
import * as Scroll from '@radix-ui/react-scroll-area';

export const ScrollAreaRoot = styled(Scroll.Root)`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  --scrollbar-size: 4px;
  border-right: 1px solid var(--line);
`;

export const ScrollAreaViewport = styled(Scroll.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`;

export const ScrollAreaScrollbar = styled(Scroll.Scrollbar)`
  display: flex;
  /* ensures no selection */
  user-select: none;
  padding: 1px;
  background: var(--line);

  &[data-orientation='vertical'] {
    width: var(--scrollbar-size);
  }
  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: var(--scrollbar-size);
  }
`;

export const ScrollAreaThumb = styled(Scroll.Thumb)`
  background: var(--line-light);
  flex: 1;
  border-radius: var(--scrollbar-size);
  position: relative;
`;
