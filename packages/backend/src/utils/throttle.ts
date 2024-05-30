export class Throttle {
  private lastUpdateTime: number;

  constructor() {
    this.lastUpdateTime = 0;
  }

  shouldExecute(interval: number): boolean {
    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime >= interval) {
      this.lastUpdateTime = currentTime;
      return true;
    }
    return false;
  }
}
