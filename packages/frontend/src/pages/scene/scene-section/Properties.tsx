import Fuse from 'fuse.js';
import { useCallback, useEffect, useState } from 'react';
import { FaCopy as CopyIcon } from 'react-icons/fa6';
import { useDevtoolStore } from '../../../App';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { PropertyEntry } from '../../../components/properties/propertyEntry';
import type { PropertyPanelData } from '../../../components/properties/propertyTypes';
import { propertyMap } from '../../../components/properties/propertyTypes';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { TooltipWrapper } from '../../../components/ui/tooltip';
import { copyToClipboard, formatCamelCase } from '../../../lib/utils';

interface PanelProps {
  children: React.ReactNode;
  onSearch?: (searchTerm: string) => void;
  onCopy?: () => void;
}
const Panel: React.FC<PanelProps> = ({ children, onSearch, onCopy }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <>
      <div className="relative left-0 top-0 w-full overflow-hidden">
        {/* panel wrapper */}
        <div className="flex h-full flex-col">
          {/* search bar */}
          <div className="border-border flex h-8 max-h-8 items-center border-b">
            {/* search wrapper */}
            <div className="hover:border-b-primary inline-block h-8 w-auto min-w-0 flex-1 cursor-text align-middle hover:border-b-2">
              <input
                type="text"
                placeholder="Search"
                className="h-8 w-full border-none bg-transparent p-2 outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Separator orientation="vertical" className="h-4" />
            <TooltipWrapper
              trigger={
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="hover:border-primary h-8 rounded-none hover:border-b-2"
                  onClick={() => onCopy?.()}
                >
                  <div className="h-3 w-3">
                    <CopyIcon className="dark:fill-white" />
                  </div>
                </Button>
              }
              tip="Copy the current properties to the clipboard"
            />
          </div>
          {/* content */}
          <div className="flex-1 overflow-auto p-2">
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function filterProps(activeProps: PropertyPanelData[], searchTerm: string, fuse: Fuse<PropertyPanelData>) {
  if (searchTerm === '') return clone(activeProps);
  return fuse.search(searchTerm).map((item) => item.item);
}

function createFuse(activeProps: PropertyPanelData[]) {
  return new Fuse(clone(activeProps), {
    keys: ['entry.label', 'prop'],
    includeScore: true,
    findAllMatches: true,
    getFn: (prop: PropertyPanelData) => prop.entry.label ?? formatCamelCase(prop.prop),
  });
}

export const Properties: React.FC = () => {
  const activeProps = useDevtoolStore((state) => state.activeProps);
  const bridge = useDevtoolStore.use.bridge()!;
  const [currentSearch, setCurrentSearch] = useState('');
  const [fuse, setFuse] = useState(createFuse(activeProps));
  const [filteredPropIds, setFilteredPropIds] = useState(
    filterProps(activeProps, currentSearch, fuse) as PropertyPanelData[],
  );
  const sections: Record<string, PropertyPanelData[]> = {};

  useEffect(() => {
    const fuse = createFuse(activeProps);
    setFuse(fuse);
    const props = filterProps(activeProps, currentSearch, fuse);
    setFilteredPropIds(props);
  }, [activeProps, currentSearch]);

  const handlePropertyChange = useCallback(
    (property: string, newValue: any) => {
      bridge(`
        window.__PIXI_DEVTOOLS_WRAPPER__.properties.setValue('${property}', ${newValue})
      `);
    },
    [bridge],
  );

  filteredPropIds.forEach((prop) => {
    if (!sections[prop.entry.section]) {
      sections[prop.entry.section] = [];
    }
    sections[prop.entry.section].push({
      ...prop,
      entry: {
        ...prop.entry,
        onChange: handlePropertyChange.bind(null, prop.prop),
      },
    });
  });

  const onSearch = (searchTerm: string) => {
    setFuse(createFuse(activeProps));
    setCurrentSearch(searchTerm);
  };

  const onCopy = (section?: string) => {
    let props = activeProps;
    if (section) props = sections[section as string];
    // create a json object with the current properties
    const properties = props.reduce(
      (acc, prop) => {
        if (prop.entry.type === 'button') return acc;
        acc[prop.prop] = prop.value;
        return acc;
      },
      {} as Record<string, any>,
    );

    copyToClipboard(JSON.stringify(properties, null, 2));
  };

  // need to pass in the section name to copy to allow for copying of individual sections
  return (
    <Panel onSearch={onSearch} onCopy={onCopy}>
      {(Object.keys(sections) as (keyof typeof sections)[]).map((section) => (
        <CollapsibleSection key={section} title={section} className="border-x" onCopy={() => onCopy(section)}>
          <div className="px-2 py-1 [&>*:first-child]:pt-0">
            {sections[section].map((prop, i) => {
              const Component = propertyMap[prop.entry.type];
              return (
                <PropertyEntry
                  key={`${prop.prop}-${i}`}
                  title={prop.entry.label ?? formatCamelCase(prop.prop)}
                  tooltip={prop.entry.tooltip}
                  input={<Component {...prop} />}
                  isLast={i === sections[section].length - 1}
                />
              );
            })}
          </div>
        </CollapsibleSection>
      ))}
    </Panel>
  );
};
