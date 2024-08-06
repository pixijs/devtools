export class Stats {
  private frames: number = 0;
  private prevTime: number = 0;
  public fps: number = 0;
  public memory: number = 0;
  public maxMemory: number = 0;
  public drawCalls: number = 0;

  public update(): void {
    this.frames++;

    const time = (performance || Date).now();

    if (time >= this.prevTime + 1000) {
      this.fps = (this.frames * 1000) / (time - this.prevTime);
      this.prevTime = time;
      this.frames = 0;

      // @ts-expect-error it does exist in chrome
      const memory = performance.memory;
      this.memory = memory.usedJSHeapSize / 1048576;
      this.maxMemory = memory.jsHeapSizeLimit / 1048576;
    }
  }

  public reset(): void {
    this.frames = 0;
    this.prevTime = 0;
    this.fps = 0;
    this.memory = 0;
    this.maxMemory = 0;
    this.drawCalls = 0;
  }
}
