import { SliderProps } from '@radix-ui/react-slider';
import { SwitchProps } from '@radix-ui/react-switch';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useState } from 'react';
import { FaCopy as CopyIcon } from 'react-icons/fa6';
import { useDevtoolStore } from '../../../App';
import { CollapsibleSection } from '../../../components/collapsible/collapsible-section';
import { ColorInput, ColorProps } from '../../../components/properties/color';
import { PropertyEntry } from '../../../components/properties/property';
import { Vector2, Vector2Props, VectorX, VectorXProps } from '../../../components/properties/vector2';
import { Button, ButtonProps } from '../../../components/ui/button';
import { Input, InputProps } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import { Slider } from '../../../components/ui/slider';
import { Switch } from '../../../components/ui/switch';
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
            <Button
              variant="ghost"
              size="icon"
              className="hover:border-primary h-8 rounded-none hover:border-b-2"
              onClick={() => onCopy?.()}
            >
              <CopyIcon className="dark:fill-white" />
            </Button>
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

export type PropertyTypes =
  | 'boolean'
  | 'number'
  | 'range'
  | 'select'
  | 'text'
  | 'button'
  | 'vector2'
  | 'vectorX'
  | 'color';
type SelectionProps = { options: string[] };
type ButtonFnProps = { label: string } & ButtonProps;
export type PropertyPanelData = {
  value: any;
  prop: string;
  entry: {
    section: string;
    label?: string;
    type: PropertyTypes;
    options?: InputProps | SwitchProps | Vector2Props | SliderProps | SelectionProps | any;
    onChange: (value: string | number | boolean) => void;
  };
};

const BooleanProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Switch
      className="bg-border h-6"
      {...(entry.options as SwitchProps)}
      checked={value}
      onCheckedChange={entry.onChange}
    />
  );
};

const NumberProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Input
      {...entry.options}
      type="number"
      value={value}
      onChange={(e) => entry.onChange(Number(e.target.value))}
      className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded text-xs outline-none"
    />
  );
};

const Vector2Property: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return <Vector2 {...(entry.options as Vector2Props)} onChange={entry.onChange} value={value} />;
};

const RangeProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Slider
      {...(entry.options as SliderProps)}
      value={[value]}
      onValueChange={(value) => entry.onChange(JSON.stringify(value))}
      className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded outline-none"
    />
  );
};

const SelectProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Select value={value} onValueChange={(value) => entry.onChange(JSON.stringify(value))}>
      <SelectTrigger className="border-border hover:border-secondary focus:border-secondary h-7 w-full text-sm outline-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(entry.options as SelectionProps).options.map((option: string) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const ButtonProperty: React.FC<PropertyPanelData> = ({ entry }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded outline-none"
      onClick={() => entry.onChange(true)}
      {...(entry.options as ButtonFnProps)}
    >
      {(entry.options as ButtonFnProps)?.label ?? entry.label ?? 'Click'}
    </Button>
  );
};

const VectorXProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return <VectorX {...(entry.options as VectorXProps)} onChange={entry.onChange} value={value} />;
};

const ColorProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return <ColorInput {...(entry.options as ColorProps)} value={value} onChange={entry.onChange} />;
};

const TextProperty: React.FC<PropertyPanelData> = ({ value, entry }) => {
  return (
    <Input
      {...entry.options}
      type="text"
      value={value}
      onChange={(e) => entry.onChange(JSON.stringify(e.target.value))}
      className="border-border hover:border-secondary focus:border-secondary h-6 w-full rounded text-xs outline-none"
    />
  );
};

const properties: Record<PropertyTypes, React.FC<PropertyPanelData>> = {
  boolean: BooleanProperty,
  number: NumberProperty,
  vector2: Vector2Property,
  range: RangeProperty,
  select: SelectProperty,
  text: TextProperty,
  button: ButtonProperty,
  vectorX: VectorXProperty,
  color: ColorProperty,
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
    if (prop.value == null) return;
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
          <div className="p-2 [&>*:first-child]:pt-0">
            {sections[section].map((prop, i) => {
              const Component = properties[prop.entry.type];
              return (
                <PropertyEntry
                  key={`${prop.prop}-${i}`}
                  title={prop.entry.label ?? formatCamelCase(prop.prop)}
                  input={<Component {...prop} />}
                />
              );
            })}
          </div>
        </CollapsibleSection>
      ))}
    </Panel>
  );
};
