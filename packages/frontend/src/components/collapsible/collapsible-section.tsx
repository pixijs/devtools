import { cn } from '../../lib/utils';
import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';

interface CollapsibleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title: string;
}
export const CollapsibleSection = ({ className, children, title }: CollapsibleSectionProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className={cn(
          'border-border bg-muted hover:border-b-primary flex h-8 w-full cursor-pointer items-center justify-between border-b border-t px-4 text-sm font-bold',
          className,
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div>{title}</div>
        <FaAngleDown className={cn('transform', collapsed ? 'rotate-180' : 'rotate-0')} />
      </div>
      {!collapsed && children}
    </>
  );
};
