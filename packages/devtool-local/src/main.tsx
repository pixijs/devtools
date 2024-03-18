import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@devtool/frontend/App';
import type { BridgeFn } from '@devtool/frontend/lib/utils';

// {
//   id: 'root',
//   name: 'root',
//   children: [
//     {
//       id: 'child1',
//       name: 'child1',
//       children: [
//         {
//           id: 'child1-1',
//           name: 'child1-1',
//           children: [],
//           metadata: {
//             type: 'Sprite',
//             uid: 'child1-1',
//           },
//         },
//       ],
//       metadata: {
//         type: 'Container',
//         uid: 'child1',
//       },
//     },
//     {
//       id: 'child2',
//       name: 'child2',
//       children: [
//         {
//           id: 'child2-1',
//           name: 'child2-1',
//           children: [],
//           metadata: {
//             type: 'Sprite',
//             uid: 'child2-1',
//           },
//         },
//       ],
//       metadata: {
//         type: 'Container',
//         uid: 'child2',
//       },
//     },
//   ],
//   metadata: {
//     type: 'Container',
//     uid: 'root',
//   },
// },

const messageListeners: ((message: unknown) => void)[] = [];
const mockChrome = {
  runtime: {
    connect: () => ({
      postMessage: () => {},
      onMessage: {
        addListener: (listner: (message: unknown) => void) => {
          messageListeners.push(listner);
        },
      },
    }),
  },
  devtools: {
    inspectedWindow: {
      tabId: 0,
      eval: (code: string, cb: () => void) => {
        eval(code);
        cb();
      },
    },
  },
} as unknown as typeof chrome;

const mockBridge: BridgeFn = (): Promise<any> => {
  // eval(code);
  return Promise.resolve();
};

let dt = 0;
const dataA = {
  fps: 60,
};
const dataB = {
  fps: 30,
  other: 30,
};
let currentData = dataA;
const scene = {
  id: 'root',
  name: 'root',
  children: [],
  metadata: {
    type: 'Container',
    uid: 'root',
  },
};
// create 100 nodes
let prevNode = scene;
for (let i = 0; i < 10; i++) {
  const node = {
    id: `node-${i}`,
    name: `node-${i}`,
    metadata: {
      type: 'Container',
      uid: 'root',
    },
    readOnly: false,
    children: [],
  };
  prevNode.children.push(node);
  prevNode = node;
}
// every 1 second, send a message to the devtools
setInterval(() => {
  // every 3 seconds change the stats
  dt += 1;

  let stats = currentData;
  if (dt % 6 === 0) {
    stats = currentData = currentData === dataA ? dataB : dataA;
  }

  messageListeners.forEach((listener) => {
    listener({
      method: 'pixi-state-update',
      data: JSON.stringify({
        version: '8.0.0',
        stats,
        selectedNode: 'node-1',
        activeProps: [
          {
            value: [0, 100],
            prop: 'position',
            entry: {
              section: 'Transform',
              type: 'vector2',
              options: {
                label: 'Position',
                x: {
                  label: 'x',
                },
                y: {
                  label: 'y',
                },
              },
            },
          },
          {
            value: 0,
            prop: 'width',
            entry: {
              section: 'Section 2',
              label: 'Width',
              type: 'number',
              options: {},
            },
          },
          {
            value: true,
            prop: 'width',
            entry: {
              section: 'Section 2',
              label: 'Width',
              type: 'boolean',
              options: {},
            },
          },
          {
            value: 0.5,
            prop: 'height and things',
            entry: {
              section: 'Section 2',
              type: 'range',
              options: {
                min: 0,
                max: 1,
                step: 0.05,
              },
            },
          },
          {
            value: 'a',
            prop: 'helloWorld',
            entry: {
              section: 'Section 2',
              type: 'select',
              options: {
                options: ['a', 'b', 'c'],
              },
            },
          },
          {
            value: 0xff0000,
            prop: 'tint',
            entry: {
              section: 'Section 2',
              type: 'color',
            },
          },
          {
            value: [1, 2, 3, 4],
            prop: 'bounds',
            entry: {
              section: 'Section 2',
              type: 'vectorX',
              options: {
                inputs: [{ label: 'x' }, { label: 'y' }, { label: 'width' }, { label: 'height' }],
              },
            },
          },
        ],
        sceneGraph: scene,
      }),
    });
  });
}, 1000);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App bridge={mockBridge} chromeProxy={mockChrome} />
  </React.StrictMode>,
);
