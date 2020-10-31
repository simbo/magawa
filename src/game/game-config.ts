import { MainScene } from './scenes/main.scene';


export const gameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  scene: [MainScene],
};
