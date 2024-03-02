import { CollapsibleSplit } from '../../components/collapsible/collapsible-split';
import { Stats } from './Stats';
import { Tree } from './scene-tree/Tree';
import { Properties } from './scene-tree/Properties';

export const ScenePanel = () => {
  // show the stats and the scene tree
  return (
    <div className="flex flex-grow flex-col overflow-hidden">
      <Stats />
      <CollapsibleSplit left={<Tree />} right={<Properties />} rightOptions={{ minSize: 30 }} />
    </div>
  );
};
