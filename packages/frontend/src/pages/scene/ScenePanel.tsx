import { CollapsibleSplit } from '../../components/collapsible/collapsible-split';
import { Stats } from './stats-section/Stats';
import { Properties } from './scene-section/Properties';
import { Tree2 } from './scene-section/Tree2';

export const ScenePanel = () => {
  // show the stats and the scene tree
  return (
    <div className="flex flex-grow flex-col overflow-hidden">
      <Stats />
      <CollapsibleSplit left={<Tree2 />} right={<Properties />} rightOptions={{ minSize: 30 }} />
    </div>
  );
};
