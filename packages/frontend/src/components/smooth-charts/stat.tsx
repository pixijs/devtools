class Panel {
  public canvas: HTMLCanvasElement;
  public name: string;
  protected fg: CanvasFillStrokeStyles['fillStyle'];
  protected bg: CanvasFillStrokeStyles['fillStyle'];
  protected lineColor: CanvasFillStrokeStyles['fillStyle'];
  protected min: number;
  protected max: number;
  protected context: CanvasRenderingContext2D;
  protected PR = 2;
  protected WIDTH = 250;
  protected HEIGHT = 55;
  protected TEXT_X = 0;
  protected TEXT_Y = 0;
  protected GRAPH_X = 0;
  protected GRAPH_Y = 25;
  protected GRAPH_WIDTH = 250;
  protected GRAPH_HEIGHT = 30;

  private _maxValue!: number;

  constructor(
    canvas: HTMLCanvasElement,
    name: string,
    fg: CanvasFillStrokeStyles['fillStyle'],
    bg: CanvasFillStrokeStyles['fillStyle'],
    lineColor: CanvasFillStrokeStyles['fillStyle'],
  ) {
    this.name = name;
    this.fg = fg;
    this.bg = bg;
    this.lineColor = lineColor;

    this.min = Infinity;
    this.max = 0;

    this.canvas = canvas;
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.canvas.style.cssText = `width:${this.WIDTH}px;height:${this.HEIGHT}px`;

    this.context = this.canvas.getContext('2d')!;
    this.context.textBaseline = 'top';

    this.context.fillStyle = bg;
    this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  public update(value: number) {
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
    this._maxValue = Math.max(this.max, this._maxValue || 0);

    this.context.fillStyle = this.bg;
    this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
    this.context.fillStyle = 'white';
    this.context.font = `0.75rem cascadia code,Menlo,Monaco,'Courier New',monospace`;
    this.context.fillText(`${this.name} (${Math.round(value)})`, this.TEXT_X, this.TEXT_Y);
    const width1 = this.context.measureText(`max: ${Math.round(this.max)}`).width;
    const width2 = this.context.measureText(`min: ${Math.round(this.min)}`).width;
    const largestWidth = Math.max(width1, width2);
    const x = this.WIDTH - largestWidth;
    this.context.fillText(`max: ${Math.round(this.max)}`, x, this.TEXT_Y);
    this.context.fillText(`min: ${Math.round(this.min)}`, x, this.TEXT_Y + 12);

    this.context.fillStyle = this.fg;
    this.context.drawImage(
      this.canvas,
      this.GRAPH_X + this.PR,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT,
      this.GRAPH_X,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT,
    );

    const lineHeight = 1;

    if (value !== 0) {
      this.context.fillStyle = this.lineColor;
      this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);
    }

    let downHeight = Math.round((1 - value / this._maxValue) * this.GRAPH_HEIGHT) + lineHeight;
    if (value === 0) {
      downHeight = this.GRAPH_HEIGHT - lineHeight;
    }
    this.context.fillStyle = this.bg;
    this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, downHeight);
    this.context.fillStyle = this.fg;
    this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y + downHeight, this.PR, lineHeight);
  }
}

import React, { memo, useEffect, useRef } from 'react';
import { useInterval } from '../../lib/interval';

interface CanvasProps {
  title: string;
  bgColor: string;
  fgColor: string;
  lineColor: string;
  value: number;
}
export const CanvasComponent: React.FC<CanvasProps> = memo(({ title, bgColor, fgColor, lineColor, value }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<Panel | null>(null);

  useEffect(() => {
    if (canvasRef.current && !panelRef.current) {
      // Initialize the Panel class with the canvas element
      panelRef.current = new Panel(canvasRef.current, title, fgColor, bgColor, lineColor);
    }
  }, [bgColor, fgColor, lineColor, title]);

  useInterval(() => {
    if (panelRef.current) {
      panelRef.current.update(value);
    }
  }, 100);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
});
