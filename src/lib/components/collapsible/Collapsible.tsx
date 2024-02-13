import React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import {
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleHeaderIcon,
  CollapsibleRoot,
  CollapsibleTrigger,
} from './styles';

interface CollapsibleProps {
  title: string;
  children?: React.ReactNode;
  contentWrap?: 'wrap' | 'nowrap';
}
const CollapsibleComponent: React.FC<CollapsibleProps> = ({ children, title, contentWrap }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <CollapsibleRoot open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <CollapsibleHeader>
          <span className="Text">{title}</span>
          <CollapsibleHeaderIcon>{open ? <FaAngleDown /> : <FaAngleUp />}</CollapsibleHeaderIcon>
        </CollapsibleHeader>
      </CollapsibleTrigger>
      <CollapsibleContent wrap={contentWrap}>{children}</CollapsibleContent>
    </CollapsibleRoot>
  );
};

export default CollapsibleComponent;
