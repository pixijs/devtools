import Fuse from 'fuse.js';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react';
import { useDevtoolStore } from '../../../App';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Separator } from '../../../components/ui/separator';
import { useInterval } from '../../../lib/interval';
import type { TextureDataState } from '../assets';
import { TextureViewer } from './TextureViewer';
import { clone, isDifferent } from '../../../lib/utils';
import {
  FaFilter as FilterIcon,
  FaSort as SortIcon,
  FaSortUp as SortUp,
  FaSortDown as SortDown,
} from 'react-icons/fa6';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';

interface PanelProps {
  children: React.ReactNode;
  onSearch?: (searchTerm: string) => void;
  searchTerm: string;
  onChannelChange: (channel: 'both' | 'loaded' | 'unloaded') => void;
  channel: 'both' | 'loaded' | 'unloaded';
  onSortName: () => void;
  onSortSize: () => void;
  onSortNew: () => void;
  nameSort: 'asc' | 'desc' | null;
  sizeSort: 'asc' | 'desc' | null;
  newSort: 'asc' | 'desc' | null;
}

const Sorter: React.FC<{ onSort: () => void; sort: 'asc' | 'desc' | null; title: string }> = (props) => {
  return (
    <div
      className="hover:border-primary flex h-full cursor-pointer items-center space-x-2 rounded-none px-2 hover:border-b-2"
      onClick={props.onSort}
    >
      {props.sort === 'asc' ? (
        <SortUp className="dark:fill-white" />
      ) : props.sort === 'desc' ? (
        <SortDown className="dark:fill-white" />
      ) : (
        <SortIcon className="dark:fill-white" />
      )}
      <p className="pointer-events-none text-sm">{props.title}</p>
    </div>
  );
};

const Panel: React.FC<PanelProps> = ({
  children,
  onSearch,
  searchTerm,
  onChannelChange,
  channel,
  onSortName,
  onSortSize,
  onSortNew,
  nameSort,
  sizeSort,
  newSort,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="border-border flex h-8 max-h-8 items-center border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hover:border-primary flex h-full cursor-pointer items-center space-x-2 rounded-none px-2 hover:border-b-2">
                <FilterIcon className="dark:fill-white" />
                <p className="pointer-events-none text-sm">Filter</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="py-2 pl-2">
                <RadioGroup defaultValue="both" value={channel} onValueChange={onChannelChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="all" />
                    <div>All</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="loaded" id="loaded" />
                    <div>GPU Loaded</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unloaded" id="unloaded" />
                    <div>GPU Unloaded</div>
                  </div>
                </RadioGroup>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="h-4" />
          <Sorter onSort={onSortNew} sort={newSort} title="Latest" />
          <Separator orientation="vertical" className="h-4" />
          <Sorter onSort={onSortName} sort={nameSort} title="Name" />
          <Separator orientation="vertical" className="h-4" />
          <Sorter onSort={onSortSize} sort={sizeSort} title="Size" />
          <Separator orientation="vertical" className="h-4" />
          <div className="hover:border-b-primary inline-block h-8 w-auto min-w-0 flex-1 cursor-text align-middle hover:border-b-2">
            <input
              type="text"
              placeholder="Search"
              className="h-8 w-full border-none bg-transparent p-2 outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

function createFuse(activeProps: TextureDataState[]) {
  return new Fuse(clone(activeProps), {
    keys: ['entry.label', 'prop'],
    includeScore: true,
    findAllMatches: true,
    getFn: (prop: TextureDataState) => prop.name,
  });
}

function filterProps(activeProps: TextureDataState[], searchTerm: string, fuse: Fuse<TextureDataState>) {
  if (searchTerm === '') return clone(activeProps);
  return fuse.search(searchTerm).map((item) => item.item);
}

export const GPUTextures: React.FC = () => {
  const bridge = useDevtoolStore.use.bridge()!;
  const textures = useDevtoolStore.use.textures();
  const setTextures = useDevtoolStore.use.setTextures();
  const selectedTexture = useDevtoolStore.use.selectedTexture();
  const setSelectedTexture = useDevtoolStore.use.setSelectedTexture();
  const [currentSearch, setCurrentSearch] = useState('');
  const [filteredTextures, setFilteredTextures] = useState<TextureDataState[]>([]);
  const [channel, setChannel] = useState<'both' | 'loaded' | 'unloaded'>('both');
  const [nameSort, setNameSort] = useState<'asc' | 'desc' | null>(null);
  const [sizeSort, setSizeSort] = useState<'asc' | 'desc' | null>(null);
  const [newSort, setNewSort] = useState<'asc' | 'desc' | null>('desc');

  useEffect(() => {
    // Directly create a fuse instance here since it's only needed when textures or currentSearch changes
    const fuse = createFuse(textures);
    const filtered = filterProps(textures, currentSearch, fuse);
    const filteredLoaded = filtered.filter((texture) => {
      if (channel === 'both') return true;
      return channel === 'loaded' ? texture.isLoaded : !texture.isLoaded;
    });

    // sort by name
    if (nameSort) {
      filteredLoaded.sort((a, b) => {
        if (nameSort === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    }

    // sort by size
    if (sizeSort) {
      filteredLoaded.sort((a, b) => {
        const aValue = a.gpuSize;
        const bValue = b.gpuSize;
        if (sizeSort === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    // sort by new
    if (newSort) {
      if (newSort === 'asc') {
        filteredLoaded.reverse();
      }
    }

    setFilteredTextures(filteredLoaded);
  }, [textures, currentSearch, channel, nameSort, sizeSort, newSort]);

  const onSearch = (searchTerm: string) => {
    setCurrentSearch(searchTerm);
  };

  const onChannelChange = (channel: 'both' | 'loaded' | 'unloaded') => {
    setChannel(channel);
  };

  const onSort = (value: 'asc' | 'desc' | null, setValue: Dispatch<SetStateAction<'asc' | 'desc' | null>>) => {
    // we need to set the others to null
    const list = [setNameSort, setSizeSort, setNewSort];
    return () => {
      if (value === 'desc') {
        setValue('asc');
      } else if (value === 'asc') {
        setValue(null);
      } else {
        setValue('desc');
      }

      list.forEach((set) => {
        if (set !== setValue) {
          set(null);
        }
      });
    };
  };

  const onClick = (texture: TextureDataState) => {
    if (selectedTexture === texture) {
      setSelectedTexture(null);
    } else {
      setSelectedTexture(texture);
    }
  };

  useInterval(async () => {
    const res = await bridge(`
      window.__PIXI_DEVTOOLS_WRAPPER__.textures.get()
    `);

    if (isDifferent(res, textures)) {
      setTextures(res as any[]);
    }
  }, 1000);

  return (
    <Panel
      onSearch={onSearch}
      searchTerm={currentSearch}
      onChannelChange={onChannelChange}
      channel={channel}
      onSortName={onSort(nameSort, setNameSort)}
      nameSort={nameSort}
      onSortSize={onSort(sizeSort, setSizeSort)}
      sizeSort={sizeSort}
      onSortNew={onSort(newSort, setNewSort)}
      newSort={newSort}
    >
      <div className="flex h-full w-full flex-wrap content-start justify-start gap-1 overflow-auto p-2">
        {filteredTextures.map((texture, index) => (
          <TextureViewer
            {...texture}
            key={index}
            onClick={() => onClick(texture)}
            selected={selectedTexture === texture}
          />
        ))}
      </div>
    </Panel>
  );
};
