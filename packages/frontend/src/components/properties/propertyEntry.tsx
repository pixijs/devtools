import { memo } from 'react';
import { cn } from '../../lib/utils';
import { Separator } from '../ui/separator';
import { TooltipWrapper } from '../ui/tooltip';

interface PropertyEntryProps {
  title: string;
  input: React.ReactNode;
  className?: string;
  tooltip?: string;
  isLast: boolean;
}
export const PropertyEntry: React.FC<PropertyEntryProps> = memo(({ title, input, className, tooltip, isLast }) => {
  return (
    <>
      <div className={cn('flex h-full items-center pt-1', className)}>
        {tooltip ? (
          <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs">
            <TooltipWrapper trigger={<div className="text-start">{title}</div>} tip={tooltip} />
          </div>
        ) : (
          <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs">{title}</div>
        )}
        <div className="flex w-full items-center pl-2">{input}</div>
      </div>
      {!isLast && <Separator orientation="horizontal" className="mt-1 opacity-40" />}
    </>
  );
});
