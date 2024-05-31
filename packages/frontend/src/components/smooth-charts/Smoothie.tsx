import React from 'react';
import type { IChartOptions, ITimeSeriesOptions, ITimeSeriesPresentationOptions } from 'smoothie';
import { SmoothieChart, TimeSeries } from 'smoothie';

function DefaultTooltip(props: { display?: boolean; time?: number; data?: TooltipData }) {
  if (!props.display) return <div />;

  return (
    <div style={{ userSelect: 'none' }}>
      <strong>{props.time}</strong>
      {props.data ? (
        <ul>
          {props.data.map((data, i) => (
            <li key={i}>{data.value}</li>
          ))}
        </ul>
      ) : (
        <div />
      )}
    </div>
  );
}

export type ToolTip = typeof DefaultTooltip;

// TODO: SmoothieCharts should update their types so that this is less hacky
type CanvasStyle = CanvasGradient | CanvasPattern;

/**
 * undefined means 0
 */
type rgba = { r?: number; g?: number; b?: number; a?: number };

type RGBA = Required<rgba>;

export type PresentationOptions = rgba & {
  fillStyle?: rgba | CanvasStyle | ITimeSeriesPresentationOptions['fillStyle'];
  strokeStyle?: rgba | CanvasStyle | ITimeSeriesPresentationOptions['strokeStyle'];
} & Omit<ITimeSeriesPresentationOptions, 'fillStyle' | 'strokeStyle'>;

function isCanvasStyle(value: any): value is CanvasStyle {
  return value instanceof CanvasGradient || value instanceof CanvasPattern;
}

function convertRGBAtoCSSString(rgba: RGBA): string {
  const css = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
  return css;
}

function extractRGBAFromPresentationOptions(options: PresentationOptions): RGBA {
  const { r, g, b, a } = options;
  return {
    r: r ?? 0,
    g: g ?? 0,
    b: b ?? 0,
    a: a ?? 0,
  };
}

/**
 * We want to let users specify the presentation options a little more loosely.
 *
 * This converts our `PresentationOptions` to the options that SmoothieChart expects.
 */
function seriesOptsParser(opts: PresentationOptions): ITimeSeriesPresentationOptions {
  const defColor = extractRGBAFromPresentationOptions(opts);

  let fillStyle: PresentationOptions['fillStyle'];

  if (isCanvasStyle(opts.fillStyle) || typeof opts.fillStyle === 'string') {
    fillStyle = opts.fillStyle;
  } else {
    fillStyle = convertRGBAtoCSSString({ ...defColor, ...{ a: 0.2 }, ...opts.fillStyle });
  }

  let strokeStyle: PresentationOptions['strokeStyle'];

  if (isCanvasStyle(opts.strokeStyle) || typeof opts.strokeStyle === 'string') {
    strokeStyle = opts.strokeStyle;
  } else {
    strokeStyle = convertRGBAtoCSSString({ ...defColor, ...{ a: 1 }, ...opts.strokeStyle });
  }

  const ret = {
    ...opts,
    data: '',
    // TODO: SmoothieCharts should update their types so that this is less hacky
    fillStyle: fillStyle as ITimeSeriesPresentationOptions['fillStyle'],
    strokeStyle: strokeStyle as ITimeSeriesPresentationOptions['strokeStyle'],
  };

  delete ret.r;
  delete ret.g;
  delete ret.b;
  delete ret.a;
  // @ts-expect-error - third party library
  delete ret.data;

  return ret;
}

type TooltipData = { series: any; index: number; value: number }[];

type SmoothieComponentState = {
  tooltip: { time?: number; data?: TooltipData; display?: boolean; top?: number; left?: number };
};

export type SmoothieComponentSeries = { data: TimeSeries } & PresentationOptions;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Props that we've defined in this package
 */
type ReactSmoothieProps = {
  streamDelay?: number;
  height?: number;
  width?: number;
  series?: SmoothieComponentSeries[];
  tooltip?: true | false | ToolTip;
  doNotSimplifyData?: boolean;
  style?: React.CSSProperties;
  tooltipParentStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  classNameCanvas?: string;
  className?: string;
  classNameTooltip?: string;
  classNameContainer?: string;
};

/**
 * Props that we pass onto underlying Smoothie instance
 */
type SmoothieProps = Omit<IChartOptions, 'tooltip'>;

export type SmoothieComponentProps = ReactSmoothieProps & SmoothieProps;

class SmoothieComponent extends React.Component<SmoothieComponentProps, SmoothieComponentState> {
  smoothie: SmoothieChart;
  canvas!: HTMLCanvasElement;
  static defaultProps = {
    width: 800,
    height: 200,
    streamDelay: 0,
  };
  constructor(props: SmoothieComponentProps) {
    super(props);
    this.state = { tooltip: {} };

    const opts: IChartOptions = Object.assign({}, props, { tooltip: !!props.tooltip });

    // SmoothieCharts's tooltip injects a div at the end of the page.
    // This will not do. We shall make our own and intercept the data.

    const updateTooltip = (o: SmoothieComponentState['tooltip']) => {
      this.setState((state) => {
        Object.assign(state.tooltip, o);
        return state;
      });
    };

    opts.tooltipFormatter = (t, data) => {
      updateTooltip({
        time: t,
        data: props.doNotSimplifyData
          ? data
          : data.map((set) => ({
              index: set.index,
              value: set.value,
              series: { options: (set.series as TimeSeries & { options: any }).options },
            })),
      });

      return '';
    };

    const smoothie = new SmoothieChart(opts) as SmoothieChart & {
      // We need to tell TypeScript about some non-exposed internal variables

      mouseY: number;
      mouseX: number;

      // TODO: type this more better
      tooltipEl: any;
    };

    let lastDisplay: string;

    // Intercept the set data
    smoothie.tooltipEl = {
      style: {
        // Intercept when smoothie.js sets tooltipEl.style.display
        set display(v: 'block' | 'string') {
          if (v === lastDisplay) return;
          lastDisplay = v;
          updateTooltip({ display: v == 'block' });
        },
        // Get smoothie's mouse events
        set top(_v: any) {
          updateTooltip({
            top: smoothie.mouseY,
            left: smoothie.mouseX,
          });
        },
      },
    };

    if (props.series) {
      props.series.forEach((series) => {
        if (!(series.data instanceof TimeSeries)) {
          throw Error('Invalid type passed to series option');
        }

        smoothie.addTimeSeries(series.data, seriesOptsParser(series));
      });
    }

    this.smoothie = smoothie;
  }

  componentWillUnmount() {
    this.smoothie.stop();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(prevProps: SmoothieComponentProps, _prevState: SmoothieComponentState) {
    for (const series of prevProps.series!) {
      if (!this.props.series!.includes(series)) this.smoothie.removeTimeSeries(series.data);
    }

    for (const series of this.props.series!) {
      if (!prevProps.series!.includes(series)) this.smoothie.addTimeSeries(series.data, seriesOptsParser(series));
    }
  }

  render() {
    let style = {} as React.CSSProperties;

    if (this.props.responsive === true) {
      style.width = '100%';
      style.height = this.props.height;
    }

    // Prevent extra pixels in wrapping element
    style.display = 'block';

    style = this.props.style || style;

    const tooltipParentStyle = this.props.tooltipParentStyle || {
      pointerEvents: 'none',
      position: 'absolute',
      left: this.state.tooltip.left,
      top: this.state.tooltip.top,
    };

    let Tooltip = this.props.tooltip as boolean | ToolTip;

    if (Tooltip === true) {
      Tooltip = DefaultTooltip;
    }

    const canvas = (
      <canvas
        className={this.props.classNameCanvas || this.props.className}
        style={style}
        width={this.props.responsive === true ? undefined : this.props.width}
        height={this.props.height}
        ref={(canv) => (this.canvas = canv!) && this.smoothie.streamTo(canv, this.props.streamDelay)}
      />
    );

    let tooltip;
    if (Tooltip) {
      tooltip = (
        <div style={tooltipParentStyle} className={this.props.classNameTooltip}>
          <Tooltip {...this.state.tooltip} />
        </div>
      );
    }

    return (
      <div className={this.props.classNameContainer} style={this.props.containerStyle || { position: 'relative' }}>
        {canvas}
        {tooltip}
      </div>
    );
  }

  addTimeSeries(addOpts: PresentationOptions): TimeSeries;
  addTimeSeries(tsOpts: ITimeSeriesOptions, addOpts: PresentationOptions): TimeSeries;
  addTimeSeries(tsOpts: PresentationOptions | ITimeSeriesOptions, addOpts?: PresentationOptions): TimeSeries {
    if (addOpts === undefined) {
      addOpts = tsOpts as PresentationOptions;
      tsOpts = undefined as any;
    }

    const ts = tsOpts instanceof TimeSeries ? tsOpts : new TimeSeries(tsOpts as ITimeSeriesOptions);

    this.smoothie.addTimeSeries(ts, seriesOptsParser(addOpts));
    return ts;
  }

  removeTimeSeries(ts: TimeSeries) {
    this.smoothie.removeTimeSeries(ts);
  }
}

export { DefaultTooltip, TimeSeries, SmoothieComponent as default };
