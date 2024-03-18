import { useEffect } from 'react';
import { create } from 'zustand';
import { Navbar } from './components/navbar/navbar';
import { ThemeProvider } from './components/theme-provider';
import './globals.css';
import { BridgeFn, NonNullableFields, createSelectors, isDifferent } from './lib/utils';
import { AssetsPanel } from './pages/assets/AssetsPanel';
import { RenderingPanel } from './pages/rendering/RenderingPanel';
import { ScenePanel } from './pages/scene/ScenePanel';
import { sceneStateSlice } from './pages/scene/state';
import { DevtoolState } from './types';

const tabComponents = {
  Scene: <ScenePanel />,
  Assets: <AssetsPanel />,
  Rendering: <RenderingPanel />,
} as const;

export const useDevtoolStore = createSelectors(
  create<DevtoolState>((set) => ({
    active: false,
    setActive: (active: boolean) => set({ active }),

    version: null,
    setVersion: (version: DevtoolState['version']) => set({ version }),

    sceneGraph: {
      id: 'root',
      name: 'root',
      children: [],
      metadata: {
        type: 'Container',
        uid: 'root',
      },
    },
    setSceneGraph: (sceneGraph: DevtoolState['sceneGraph']) => set({ sceneGraph }),

    bridge: null,
    setBridge: (bridge: DevtoolState['bridge']) => set({ bridge }),

    ...sceneStateSlice(set),
  })),
);

interface AppProps {
  bridge: BridgeFn;
  chromeProxy: typeof chrome;
}
const App: React.FC<AppProps> = ({ bridge, chromeProxy }) => {
  const setActive = useDevtoolStore.use.setActive();
  const setVersion = useDevtoolStore.use.setVersion();
  const setSceneGraph = useDevtoolStore.use.setSceneGraph();
  const setStats = useDevtoolStore.use.setStats();
  const setBridge = useDevtoolStore.use.setBridge();
  const active = useDevtoolStore.use.active();
  const setSelectedNode = useDevtoolStore.use.setSelectedNode();
  const setActiveProps = useDevtoolStore.use.setActiveProps();

  useEffect(() => {
    setBridge(bridge);

    const devToolsConnection = chromeProxy.runtime.connect({ name: 'devtools-connection' });
    devToolsConnection.postMessage({
      name: 'init',
      tabId: chromeProxy.devtools.inspectedWindow.tabId,
    });

    devToolsConnection.onMessage.addListener((message) => {
      switch (message.method) {
        case 'pixi-active':
          {
            setActive(true);
          }
          break;
        case 'pixi-inactive':
          {
            setActive(false);
          }
          break;
        case 'pixi-state-update':
          {
            setActive(true);

            const data = JSON.parse(message.data) as NonNullableFields<DevtoolState>;
            const currentState = useDevtoolStore.getState();

            isDifferent(currentState.version, data.version) && setVersion(data.version);
            isDifferent(currentState.stats, data.stats) && setStats(data.stats);
            isDifferent(currentState.sceneGraph, data.sceneGraph) && setSceneGraph(data.sceneGraph);
            isDifferent(currentState.selectedNode, data.selectedNode) && setSelectedNode(data.selectedNode);
            isDifferent(currentState.activeProps, data.activeProps) && setActiveProps(data.activeProps);
          }
          break;
      }
    });
  }, [bridge, chromeProxy, setActive, setActiveProps, setBridge, setSceneGraph, setSelectedNode, setStats, setVersion]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="pixi-ui-theme">
      <div className="app size-screen bg-background h-screen">
        <div className="app relative flex size-full flex-col outline-none">
          {active ? (
            <Navbar defaultTab="Scene" tabs={tabComponents} />
          ) : (
            <div className="p-4 text-white">
              <h1 className="pb-4 text-2xl">PixiJS not detected</h1>
              <p>This page doesn’t appear to be using PixiJS. If this seems wrong, follow the project setup guide</p>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
