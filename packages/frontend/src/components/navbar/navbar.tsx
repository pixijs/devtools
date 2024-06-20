import { FaGear } from 'react-icons/fa6';
import { ModeToggle } from '../mode-toggle';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import logo from '../../assets/icon-active-48.png';

import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useDevtoolStore } from '../../App';
import pkg from '../../../../../package.json';

const tabVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm h-full w-full rounded-none border-r-2 border-border hover:border-b-2 hover:border-b-primary bg-muted cursor-pointer',
  {
    variants: {
      variant: {
        active: 'border-b-2 border-b-primary font-bold',
        inactive: 'font-medium',
      },
    },
    defaultVariants: {
      variant: 'active',
    },
  },
);

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  onClick?: (value: string) => void;
  isActive?: boolean;
}
const TabsTrigger = ({ children, value, onClick, isActive = false }: TabsTriggerProps) => {
  const handleClick = () => {
    onClick && onClick(value);
  };

  return (
    <div onClick={handleClick} className={cn(tabVariants({ variant: isActive ? 'active' : 'inactive' }))}>
      {children}
    </div>
  );
};

interface NavbarProps {
  tabs: Record<string, React.ReactNode>;
  defaultTab: string;
}
export const Navbar = ({ tabs, defaultTab }: NavbarProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const version = useDevtoolStore.use.version();

  const onClick = (value: string) => {
    setActiveTab(value);
  };

  const openPixiJs = () => {
    window.open('https://github.com/pixijs/pixijs');
  };

  return (
    <>
      <div className="border-border bg-muted relative flex flex-none flex-row items-center overflow-y-auto border-b">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {' '}
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-none p-1" onClick={openPixiJs}>
                <img src={logo} alt="PixiJS logo" className="size-full" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>PixiJS: {version}</p>
              <p>Devtool: {pkg.version}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex h-8 flex-1 items-center justify-evenly [&>*:first-child]:border-l-2">
          {Object.keys(tabs).map((tab) => (
            <TabsTrigger key={tab} onClick={onClick} value={tab} isActive={activeTab === tab}>
              {tab}
            </TabsTrigger>
          ))}
        </div>
        <ModeToggle />
        <Separator orientation="vertical" className="h-4" />
        <Button variant="ghost" size="icon" className="hover:border-primary h-full rounded-none hover:border-b-2">
          <FaGear className="dark:fill-white" />
        </Button>
      </div>
      {/* for each tab only render if it is active */}
      {tabs[activeTab]}
    </>
  );
};
