window.magawa.pixiLoaded = () => {
  import('./main').catch(() => {
    document.body.className = 'error';
  });
};

const webglSupport = (() => {
  try {
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ? true : false;
  } catch (e) {
    return false;
  }
})();

const pixiVersion = window.magawa.pixiVersion;
const scriptName = `pixi${webglSupport ? '' : '-legacy'}`;

const script = document.createElement('script');
script.src = `https://cdnjs.cloudflare.com/ajax/libs/pixi.js/${pixiVersion}/${scriptName}.min.js`;
script.onload = () => window.magawa.pixiLoaded();
document.body.appendChild(script);
