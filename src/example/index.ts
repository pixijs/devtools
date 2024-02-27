import * as PIXI from 'pixi.js';
import { Application, Assets, Container, Sprite } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb' });

  window.__PIXI_DEVTOOLS__ = {
    app: app,
    pixi: PIXI,
  };

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Create and add a container to the stage
  const container = new Container();

  app.stage.addChild(container);

  // Load the bunny texture
  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

  // Create a 5x5 grid of bunnies in the container
  for (let i = 0; i < 1; i++) {
    const bunny = new Sprite(texture);

    bunny.x = 300
    bunny.y = Math.floor(i / 5) * 40;
    // bunny.anchor.x = 0.5;
    bunny.anchor.set(0.5)
    bunny.label = `Bunny ${i}`;
    // bunny.filterArea = new PIXI.Rectangle(0, 0, 40, 40);
    // bunny.boundsArea = new PIXI.Rectangle(0, 0, 40, 40);
    app.stage.addChild(bunny);
  }

  // Move the container to the center
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  // Center the bunny sprites in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;
  container.label = 'scaler';

  // Listen for animate update
  app.ticker.add((time) => {
    // Continuously rotate the container!
    // * use delta to create frame-independent transform *
    // container.rotation -= 0.01 * time.deltaTime;
  });

  // add two buttons to add and remove bunnies
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Bunny';
  // position over top of everything else
  addButton.style.position = 'absolute';
  addButton.style.top = '10px';
  addButton.style.left = '10px';

  addButton.onclick = () => {
    const bunny = new Sprite(texture);
    const i = container.children.length;
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
  };

  document.body.appendChild(addButton);

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove Bunny';
  // position over top of everything else
  removeButton.style.position = 'absolute';
  removeButton.style.top = '10px';
  removeButton.style.left = '100px';
  removeButton.onclick = () => {
    container.removeChild(container.children[container.children.length - 1]);
  };

  document.body.appendChild(removeButton);
})();
