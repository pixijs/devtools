import { useEffect } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { create } from 'zustand';
import { Navbar } from './components/navbar/navbar';
import { ThemeProvider } from './components/theme-provider';
import { CopyToClipboardButton } from './components/ui/clipboard';
import './globals.css';
import { BridgeFn, NonNullableFields, createSelectors, isDifferent } from './lib/utils';
import { AssetsPanel } from './pages/assets/AssetsPanel';
import { RenderingPanel } from './pages/rendering/RenderingPanel';
import { ScenePanel } from './pages/scene/ScenePanel';
import { sceneStateSlice } from './pages/scene/state';
import { DevtoolState } from './types';

SyntaxHighlighter.registerLanguage('typescript', ts);

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
  const setOverlayPickerEnabled = useDevtoolStore.use.setOverlayPickerEnabled();

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
            isDifferent(currentState.overlayPickerEnabled, data.overlayPickerEnabled) &&
              setOverlayPickerEnabled(data.overlayPickerEnabled);
          }
          break;
      }
    });
  }, [
    bridge,
    chromeProxy,
    setActive,
    setActiveProps,
    setBridge,
    setSceneGraph,
    setSelectedNode,
    setStats,
    setVersion,
    setOverlayPickerEnabled,
  ]);

  const windowString = `import * as PIXI from 'pixi.js';

window.__PIXI_DEVTOOLS__ = {
  pixi: PIXI,
  app: app,
  // If you are not using a pixi app, you can pass the renderer and stage directly
  // renderer: myRenderer,
  // stage: myStage,
};`;

  const npmInstallString = `npm install @pixi/devtools`;
  const npmString = `import { initDevtools } from '@pixi/devtools';

initDevtools({
  app,
  // If you are not using a pixi app, you can pass the renderer and stage directly
  // renderer: myRenderer,
  // stage: myStage,
});`;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="pixi-ui-theme">
      <div className="app size-screen bg-background h-screen">
        <div className="app relative flex size-full flex-col text-sm outline-none">
          {active ? (
            <Navbar defaultTab="Scene" tabs={tabComponents} />
          ) : (
            <div className="p-4 dark:text-white">
              <h1 className="pb-4 text-2xl">PixiJS not detected</h1>
              <p>
                This page doesn’t appear to be using PixiJS. If this seems wrong, follow the project setup guide below
              </p>
              <br />
              <p>There are two ways to set up the devtool:</p>
              <div className="p-4">
                <p>1. Using the window.__PIXI_DEVTOOLS__ global variable</p>
                <div className="relative p-4">
                  <SyntaxHighlighter language="typescript" style={dracula}>
                    {windowString}
                  </SyntaxHighlighter>
                  <CopyToClipboardButton data={windowString} />
                </div>
              </div>
              <div className="p-4 pt-0">
                <p>
                  2. Using the <code>@pixi/devtools</code> package, which will handle the pixi import for you
                </p>
                <div className="relative p-4 pb-0">
                  <SyntaxHighlighter language="" style={dracula}>
                    {npmInstallString}
                  </SyntaxHighlighter>
                  <CopyToClipboardButton data={npmInstallString} />
                </div>
                <div className="relative p-4 pt-0">
                  <SyntaxHighlighter language="typescript" style={dracula}>
                    {npmString}
                  </SyntaxHighlighter>
                  <CopyToClipboardButton data={npmString} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
