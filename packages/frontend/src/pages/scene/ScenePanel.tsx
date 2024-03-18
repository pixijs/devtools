import { CollapsibleSplit } from '../../components/collapsible/collapsible-split';
import { Stats } from './stats-section/Stats';
import { Properties } from './scene-section/Properties';
import { SceneTree } from './scene-section/Tree';

export const ScenePanel = () => {
  // show the stats and the scene tree
  return (
    <div className="flex flex-grow flex-col overflow-hidden">
      <Stats />
      <CollapsibleSplit left={<SceneTree />} right={<Properties />} rightOptions={{ minSize: 30 }} />
    </div>
  );
};
