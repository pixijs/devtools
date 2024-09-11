import type { FilterAntialias } from 'pixi.js';
import React, { memo } from 'react';
import { FaCircleDot as CaptureIcon } from 'react-icons/fa6';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useDevtoolStore } from '../../../App';
import { formatNumber } from '../../../lib/utils';
import type { TextureDataState } from '../../assets/assets';
import { BatchView } from './Batch';
import { FilterView } from './Filter';
import { GraphicsView } from './Graphics';
import { MaskView } from './Mask';
import { MeshView } from './Mesh';
import { NineSliceSpriteView } from './NineSliceSprite';
import { InstructionPill } from './shared/InstructionBubble';
import type { InstructionPillProps } from './shared/InstructionBubble';
import { TilingSpriteView } from './TilingSprite';
import { CustomRenderView } from './CustomRender';
import { RenderGroupView } from './RenderGroup';

export type RenderingTextureDataState = Pick<
  TextureDataState,
  'blob' | 'pixelWidth' | 'pixelHeight' | 'name' | 'gpuSize'
>;

type XY = {
  x: number;
  y: number;
};
export type RenderableData = {
  class: string;
  type: string;
  label: string;
  anchor: XY | null;
  roundPixels: boolean | null;
  position: XY;
  width: number;
  height: number;
  scale: XY;
  rotation: number;
  angle: number;
  pivot: XY;
  skew: XY;
  visible: boolean;
  renderable: boolean;
  alpha: number;
  tint: number;
  filterArea: (XY & { width: number; height: number }) | null;
  sortableChildren: boolean;
  zIndex: number;
  blendMode: string;
  boundsArea: (XY & { width: number; height: number }) | null;
  isRenderGroup: boolean;
  cullable: boolean;
  cullArea: (XY & { width: number; height: number }) | null;
  cullableChildren: boolean;
};

export interface StateData {
  blend: boolean;
  blendMode: string;
  clockwiseFrontFace: boolean;
  cullMode: string;
  culling: boolean;
  depthMask: boolean;
  depthTest: boolean;
  offsets: boolean;
  polygonOffset: number;
}

export interface BaseInstruction {
  type: string;
  action: string;
  drawCalls: number;
  drawTextures: string[];
}

export interface BatchInstruction extends BaseInstruction {
  type: 'batch';
  action: 'startBatch' | 'renderBatch';
  blendMode: string;
  size: number;
  start: number;
  textures: RenderingTextureDataState[]; // base64 encoded
  // TODO: need to find how to get elements of a batch
}

export interface MaskInstruction extends BaseInstruction {
  type: 'stencilMask' | 'colorMask' | 'alphaMask';
  action: string;
  mask:
    | ({
        width: number;
        height: number;
      } & RenderableData)
    | null;
}

export interface FilterInstruction extends BaseInstruction {
  type: 'filter';
  action: 'pushFilter' | 'popFilter';
  filter:
    | {
        type: string;
        padding: number;
        resolution: number;
        antialias: FilterAntialias;
        blendMode: string;
        program: {
          fragment: string;
          vertex: string;
        };
        state: StateData;
      }[]
    | null;
  renderables: ({
    texture: RenderingTextureDataState | null;
  } & RenderableData)[];
}

export interface TilingSpriteInstruction extends BaseInstruction {
  type: 'tilingSprite';
  action: 'draw';
  renderable: {
    texture: RenderingTextureDataState | null;
    tilePosition: {
      x: number;
      y: number;
    };
    tileScale: {
      x: number;
      y: number;
    };
    tileRotation: number;
    clampMargin: number;
  } & RenderableData;
}

export interface NineSliceInstruction extends BaseInstruction {
  type: 'nineSlice';
  action: 'draw';
  renderable: {
    texture: RenderingTextureDataState | null;
    leftWidth: number;
    rightWidth: number;
    topHeight: number;
    bottomHeight: number;
    originalWidth: number;
    originalHeight: number;
  } & RenderableData;
}

export interface CustomRenderableInstruction extends BaseInstruction {
  type: 'customRenderable';
  action: 'draw';
  renderable: {
    texture: RenderingTextureDataState | null;
  } & RenderableData;
}

export interface MeshInstruction extends BaseInstruction {
  type: 'mesh';
  action: string;
  renderable: {
    state: StateData;
    program: {
      fragment: string | null;
      vertex: string | null;
    };
    texture: RenderingTextureDataState | null;
    geometry: {
      positions: number[];
      uvs: number[];
      indices: number[];
    };
  } & RenderableData;
}

export interface GraphicsInstruction extends BaseInstruction {
  type: 'graphics';
  action: string;
  renderable: RenderableData;
}

const _colors = [
  'fill-insRed',
  'fill-insOrange',
  'fill-insYellow',
  'fill-insDarkBlue',
  'fill-insCyan',
  'fill-insPink',
  'fill-insPurple',
  'fill-insBlue',
  'fill-insLime',
  'fill-insTan',
];

const instructionViews = {
  batch: BatchView,
  stencilMask: MaskView,
  colorMask: MaskView,
  alphaMask: MaskView,
  filter: FilterView,
  tilingSprite: TilingSpriteView,
  mesh: MeshView,
  graphics: GraphicsView,
  nineSliceSprite: NineSliceSpriteView,
  customRender: CustomRenderView,
  'Render Group': RenderGroupView,
};

export const Instructions: React.FC = memo(() => {
  const selectedInstruction = useDevtoolStore.use.selectedInstruction();
  const setSelectedInstruction = useDevtoolStore.use.setSelectedInstruction();
  const frameCaptureData = useDevtoolStore.use.frameCaptureData();

  if (!frameCaptureData) {
    return (
      <div className="flex flex-grow flex-col overflow-hidden">
        <div className="flex flex-grow items-center justify-center text-2xl dark:text-white">
          Click the <CaptureIcon className="m-4 dark:fill-white" /> button to capture the scene
        </div>
      </div>
    );
  }

  const { instructions, drawCalls, renderTime, totals } = frameCaptureData;

  const metrics = [
    { label: 'Draw Calls', value: drawCalls },
    { label: 'Render Time', value: `${formatNumber(renderTime, 3)}ms` },
    { label: 'Filters', value: totals.filters },
    { label: 'Masks', value: totals.masks },
    { label: 'Containers', value: totals.containers },
    { label: 'Sprites', value: totals.sprites },
    { label: 'Tiling Sprites', value: totals.tilingSprites },
    { label: 'NineSlice Sprite', value: totals.nineSliceSprites },
    { label: 'Graphics', value: totals.graphics },
    { label: 'Meshes', value: totals.meshes },
    { label: 'Texts', value: totals.texts },
  ];

  let renderGroupDepth = 0;
  const renderGroupColorMap: Map<string, string> = new Map();

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="relative bottom-0 right-0 w-full">
        <PanelGroup direction="horizontal">
          <Panel className="flex h-full overflow-auto" defaultSize={20} maxSize={20}>
            <div className="flex w-full flex-col overflow-hidden">
              <div className="flex flex-1 flex-col gap-2 overflow-auto p-2 dark:text-white">
                {metrics.map((metric, index) => (
                  <div key={index}>
                    <span className="opacity-50">{metric.label}:</span>
                    <span className="float-right pr-2 opacity-100">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="bg-border w-0.5" />
          <Panel className="flex h-full overflow-auto" defaultSize={25} maxSize={25}>
            <div className="flex w-full flex-col overflow-hidden">
              <div className="flex flex-1 flex-col gap-2 overflow-auto p-2">
                {instructions!.map((instruction, i) => {
                  const paddingAmount = 10;
                  let paddingLeft = renderGroupDepth * paddingAmount;

                  if (instruction.type === 'Render Group' && instruction.action === 'start') {
                    renderGroupDepth++;
                    renderGroupColorMap.set(
                      'RenderGroup: ' + renderGroupDepth,
                      _colors[renderGroupDepth % _colors.length],
                    );
                  }

                  const commonProps: InstructionPillProps = {
                    onClick: () => setSelectedInstruction(i),
                    selected: selectedInstruction === i,
                    drawTextures: instruction.drawTextures.length > 0 ? instruction.drawTextures : undefined,
                    type: instruction.type,
                    action: instruction.action,
                    renderGroupColor: renderGroupColorMap.get('RenderGroup: ' + renderGroupDepth)!,
                    isDrawCall: instruction.drawCalls > 0,
                  };

                  if (instruction.type === 'Render Group' && instruction.action === 'end') {
                    renderGroupDepth = Math.max(0, renderGroupDepth - 1);
                    paddingLeft = renderGroupDepth * paddingAmount;
                  }

                  // add padding to the left based on the depth of the render group
                  return (
                    <div key={i} style={{ paddingLeft }}>
                      <InstructionPill key={i} {...commonProps} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="bg-border w-0.5" />
          <Panel className="flex h-full overflow-auto" defaultSize={55}>
            <div className="flex w-full flex-col overflow-hidden">
              <div className="flex flex-1 flex-col gap-2 overflow-auto p-2">
                {selectedInstruction !== null &&
                  (() => {
                    const InstructionView: React.FC<any> =
                      instructionViews[instructions![selectedInstruction].type as keyof typeof instructionViews] ||
                      (() => <div> Unknown instruction type </div>);

                    return (
                      <InstructionView
                        key={`${selectedInstruction} ${instructions![selectedInstruction].type}`}
                        {...(instructions![selectedInstruction] as BatchInstruction)}
                      />
                    );
                  })()}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
});
