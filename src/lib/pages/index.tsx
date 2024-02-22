import React, { useEffect } from 'react';
import { create } from 'zustand';
import { Container } from '../components/Container';
import { SceneComponent } from '../components/scene/Scene';
import { PixiState } from '../../chrome/src/inject/devtool';
import { checkDiff } from '../utils/checkDiff';
import './index.css';
import { Content, List, Root, Trigger } from './styles';

type ZustandState = {
  pixiDetected: boolean;
  setPixiDetected: (detected: boolean) => void;
  setVersion: (version: string) => void;
  setSceneStats: (stats: PixiState['sceneStats']) => void;
  setRenderingStats: (stats: any) => void;
  setSceneGraph: (graph: PixiState['sceneGraph']) => void;

  bridge: BridgeFn;
  setBridge: (bridge: BridgeFn) => void;

  setSelectedNodeId: (id: string | null) => void;
  setSelectedNodeValues: (values: PixiState['selectedNodeValues']) => void;
  setSelectedNodeProps: (props: PixiState['selectedNodeProps']) => void;
} & PixiState;
export const usePixiStore = create<ZustandState>((set) => ({
  pixiDetected: false,
  version: '',
  setPixiDetected: (detected: boolean) => set({ pixiDetected: detected }),
  setVersion: (version: string) => set({ version: version }),

  sceneStats: {
    totalSceneObjects: 0,
    container: 0,
    sprite: 0,
    graphics: 0,
    filter: 0,
    mesh: 0,
    text: 0,
    bitmapText: 0,
    htmlText: 0,
  },
  setSceneStats: (stats: PixiState['sceneStats']) => set({ sceneStats: stats }),

  renderingStats: {
    fps: 0,
    ms: 0,
  },
  setRenderingStats: (stats: any) => set({ renderingStats: stats }),

  sceneGraph: {
    id: 'root',
    name: 'root',
    children: [],
    metadata: {
      type: 'Container',
      uid: 'root',
    },
  },
  setSceneGraph: (graph: PixiState['sceneGraph']) => set({ sceneGraph: graph }),

  bridge: null as unknown as BridgeFn,
  setBridge: (bridge: BridgeFn) => set({ bridge }),

  selectedNodeId: null,
  setSelectedNodeId: (id: string | null) => set({ selectedNodeId: id }),
  selectedNodeValues: {},
  setSelectedNodeValues: (values: PixiState['selectedNodeValues']) => set({ selectedNodeValues: values }),
  selectedNodeProps: { values: [], keys: [] },
  setSelectedNodeProps: (props: PixiState['selectedNodeProps']) => set({ selectedNodeProps: props }),
}));

const tabs = [
  {
    value: 'tab1',
    label: 'Scene',
    component: <SceneComponent />,
    disabled: false,
  },
  { value: 'tab2', label: 'Assets', component: <SceneComponent />, disabled: true },
  { value: 'tab3', label: 'Rendering', component: <SceneComponent />, disabled: true },
];

export type BridgeFn = <T>(code: string) => Promise<T>;
interface PanelProps {
  bridge: BridgeFn;
}
const Panel: React.FC<PanelProps> = ({ bridge }) => {
  const pixiDetected = usePixiStore((state) => state.pixiDetected);
  const setPixiDetected = usePixiStore((state) => state.setPixiDetected);
  const setSceneStats = usePixiStore((state) => state.setSceneStats);
  const setSceneGraph = usePixiStore((state) => state.setSceneGraph);
  const setSelectedNodeId = usePixiStore((state) => state.setSelectedNodeId);
  const setSelectedNodeValues = usePixiStore((state) => state.setSelectedNodeValues);
  const setSelectedNodeProps = usePixiStore((state) => state.setSelectedNodeProps);
  const setBridge = usePixiStore((state) => state.setBridge);

  useEffect(() => {
    setBridge(bridge);

    const devToolsConnection = chrome.runtime.connect({ name: 'devtools-connection' });
    devToolsConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });

    devToolsConnection.onMessage.addListener((message) => {
      if (message.method === 'pixi-detected') {
        setPixiDetected(true);
      } else if (message.method === 'inactive') {
        setPixiDetected(false);
      } else if (message.method === 'pixi-state-update') {
        setPixiDetected(true);
        const data = JSON.parse(message.data) as PixiState;
        if (!checkDiff(data.sceneStats, usePixiStore.getState().sceneStats)) {
          setSceneStats(data.sceneStats);
        }

        const currentSceneGraph = usePixiStore.getState().sceneGraph;
        if (!checkDiff(data.sceneGraph, currentSceneGraph)) {
          setSceneGraph(data.sceneGraph);
        }

        const currentSelectedNodeId = usePixiStore.getState().selectedNodeId;
        if (data.selectedNodeId !== currentSelectedNodeId) {
          setSelectedNodeId(data.selectedNodeId);
        }

        const currentSelectedNodeValues = usePixiStore.getState().selectedNodeValues;
        if (!checkDiff(data.selectedNodeValues, currentSelectedNodeValues)) {
          setSelectedNodeValues(data.selectedNodeValues);
        }
        const currentSelectedNodeProps = usePixiStore.getState().selectedNodeProps;
        if (!checkDiff(data.selectedNodeProps, currentSelectedNodeProps)) {
          setSelectedNodeProps(data.selectedNodeProps);
        }
      }
    });
  }, [bridge]);

  return (
    <Container>
      {pixiDetected ? (
        <Root defaultValue="tab1">
          <List aria-label="Manage your application">
            {tabs.map((tab) => (
              <Trigger key={tab.value} value={tab.value} aria-label={tab.label} disabled={tab.disabled}>
                {tab.label}
              </Trigger>
            ))}
          </List>
          {tabs.map((tab) => (
            <Content key={tab.value} value={tab.value}>
              {tab.component}
            </Content>
          ))}
        </Root>
      ) : (
        <div style={{ color: 'white' }}>
          <h2>PixiJS not detected</h2>
          <p>This page doesn’t appear to be using PixiJS. If this seems wrong, follow the project setup guide</p>
        </div>
      )}
    </Container>
  );
};

export default Panel;
