import type { GlRenderTarget, WebGLRenderer, WebGPURenderer } from 'pixi.js';

export function readGlPixels(
  gl: WebGLRenderingContext,
  renderer: WebGLRenderer,
  canvasTextures: string[],
  width: number,
  height: number,
) {
  // Create a buffer to hold the pixel data
  // Uint8Array for 8-bit per channel (RGBA), adjust as needed
  const pixels = new Uint8Array(width * height * 4);

  const renterTarget = renderer.renderTarget.getRenderTarget(renderer.renderTarget.renderTarget);
  const glRenterTarget = renderer.renderTarget.getGpuRenderTarget(renterTarget) as GlRenderTarget;
  // Bind the framebuffer you want to read from (null for default framebuffer)
  gl.bindFramebuffer(gl.FRAMEBUFFER, glRenterTarget.resolveTargetFramebuffer);

  // Read the pixels
  gl.readPixels(
    0,
    0, // Start reading from the bottom left of the framebuffer
    width,
    height, // The dimensions of the area you want to read
    gl.RGBA, // Format of the pixel data
    gl.UNSIGNED_BYTE, // Type of the pixel data
    pixels, // The buffer to read the pixels into
  );

  // Create a 2D canvas to draw the pixels on
  const canvas2d = document.createElement('canvas');
  canvas2d.width = width;
  canvas2d.height = height;
  const ctx = canvas2d.getContext('2d')!;

  // Create an ImageData object
  const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);

  // Draw the ImageData object to the canvas
  ctx.putImageData(imageData, 0, 0);

  // Convert the canvas to a data URL and set it as the src of an image element
  const dataUrl = canvas2d.toDataURL('image/webp', 0.5);
  canvasTextures.push(dataUrl);
}

export function readGPUPixels(renderer: WebGPURenderer, canvasTextures: string[]) {
  const webGPUCanvas = renderer.view.canvas as HTMLCanvasElement;

  const canvas = document.createElement('canvas');
  canvas.width = webGPUCanvas.width;
  canvas.height = webGPUCanvas.height;

  const context = canvas.getContext('2d')!;

  context.drawImage(webGPUCanvas, 0, 0);

  // const { width, height } = webGPUCanvas;

  // context.getImageData(0, 0, width, height);

  // Convert the canvas to a data URL and set it as the src of an image element
  const dataUrl = canvas.toDataURL('image/webp', 0.5);
  canvasTextures.push(dataUrl);

  // const pixels = new Uint8ClampedArray(imageData.data.buffer);

  // return { pixels, width, height };
}
