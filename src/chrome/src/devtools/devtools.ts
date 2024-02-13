chrome.devtools.panels.create(
  import.meta.env.DEV ? 'Dev: PixiJS DevTools' : 'PixiJS DevTools',
  'panel-icon.png',
  'src/devtools/panel/panel.html',
);
