import { useEffect } from 'react';
import { useDevtoolStore } from '../../App';
import { CollapsibleSplit } from '../../components/collapsible/collapsible-split';
import { useInterval } from '../../lib/interval';
import { isDifferent } from '../../lib/utils';
import { SceneTree } from './graph/SceneTree';
import { SceneStats } from './SceneStats';
import { SceneProperties } from './graph/SceneProperties';

export const ScenePanel = () => {
  const bridge = useDevtoolStore.use.bridge()!;
  const savedStats = useDevtoolStore.use.stats();
  const setStats = useDevtoolStore.use.setStats();
  useInterval(async () => {
    const res = await bridge<Record<string, number>>(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.getStats()`);

    if (isDifferent(res, savedStats)) {
      setStats(res);
    }
  }, 1000);

  const savedSceneGraph = useDevtoolStore.use.sceneGraph();
  const setSceneGraph = useDevtoolStore.use.setSceneGraph();
  const savedSelectedNode = useDevtoolStore.use.selectedNode();
  const setSelectedNode = useDevtoolStore.use.setSelectedNode();
  const savedSceneTreeData = useDevtoolStore.use.sceneTreeData();
  const setSceneTreeData = useDevtoolStore.use.setSceneTreeData();
  useInterval(async () => {
    const res = await bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.tree.getSceneGraph()`);

    if (!res) return;

    const { sceneGraph, selectedNode, sceneTreeData } = res as {
      sceneGraph: typeof savedSceneGraph;
      selectedNode: typeof savedSelectedNode;
      sceneTreeData: typeof savedSceneTreeData;
    };

    if (sceneGraph !== null && isDifferent(sceneGraph, savedSceneGraph)) {
      setSceneGraph(sceneGraph);
    }

    if (isDifferent(selectedNode, savedSelectedNode)) {
      setSelectedNode(selectedNode);
    }

    if (isDifferent(sceneTreeData, savedSceneTreeData)) {
      setSceneTreeData(sceneTreeData);
    }
  }, 1000);

  const overlayHighlightEnabled = useDevtoolStore.use.overlayHighlightEnabled();
  const overlayPickerEnabled = useDevtoolStore.use.overlayPickerEnabled();
  useInterval(async () => {
    const res = await bridge<string>(`window.__PIXI_DEVTOOLS_WRAPPER?__.scene.tree.getSelectedNode()`);

    if (isDifferent(res, savedSelectedNode)) {
      setSelectedNode(res);
    }

    bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.overlay.enableHighlight(${overlayHighlightEnabled})`);
    bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.overlay.enablePicker(${overlayPickerEnabled})`);
  }, 100);

  // send heartbeat to the backend
  useEffect(() => {
    bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.overlay.enableHighlight(${overlayHighlightEnabled})`);
    bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.overlay.enablePicker(${overlayPickerEnabled})`);

    return () => {
      bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.overlay.enableHighlight(false)`);
      bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.scene.overlay.enablePicker(false)`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedActiveProps = useDevtoolStore.use.activeProps();
  const setActiveProps = useDevtoolStore.use.setActiveProps();

  useInterval(async () => {
    const res = await bridge<typeof savedActiveProps>(
      `window.__PIXI_DEVTOOLS_WRAPPER__?.scene.properties.getActiveProps()`,
    );

    if (!res) return;

    if (isDifferent(res, savedActiveProps)) {
      setActiveProps(res);
    }
  }, 100);

  return (
    <div className="flex flex-grow flex-col overflow-hidden">
      <SceneStats />
      <CollapsibleSplit left={<SceneTree />} right={<SceneProperties />} rightOptions={{ minSize: 30 }} title="Scene" />
    </div>
  );
};
