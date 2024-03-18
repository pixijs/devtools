import { cn } from '../../lib/utils';
import { Separator } from '../ui/separator';

interface PropertyEntryProps {
  title: string;
  input: React.ReactNode;
  className?: string;
}
export const PropertyEntry: React.FC<PropertyEntryProps> = ({ title, input, className }) => {
  return (
    <>
      <div className={cn('flex h-full items-center pt-2', className)}>
        <div className="w-1/4 overflow-hidden break-keep pr-2 text-xs">{title}</div>
        <div className="flex w-full items-center pl-2">{input}</div>
      </div>
      <Separator orientation="horizontal" className="mt-2 opacity-40" />
    </>
  );
};
