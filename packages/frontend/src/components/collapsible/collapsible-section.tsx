import { cn } from '../../lib/utils';
import { useState } from 'react';
import { FaAngleDown, FaCopy as CopyIcon } from 'react-icons/fa6';

interface CollapsibleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title: string;
  onCopy?: () => void;
  defaultCollapsed?: boolean;
}
export const CollapsibleSection = ({
  className,
  children,
  title,
  onCopy,
  defaultCollapsed,
}: CollapsibleSectionProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? false);

  return (
    <>
      <div
        className={cn(
          'border-border bg-muted hover:border-b-primary flex h-8 w-full cursor-pointer items-center justify-between border-b border-t px-4 text-sm font-bold',
          className,
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          {onCopy && (
            <CopyIcon
              onClick={(e) => {
                onCopy();
                e.stopPropagation();
              }}
              className="hover:fill-primary cursor-pointer opacity-45 hover:opacity-100"
            />
          )}
          <div>{title}</div>
        </div>
        <FaAngleDown className={cn('transform', collapsed ? 'rotate-180' : 'rotate-0')} />
      </div>
      {!collapsed && children}
    </>
  );
};
