import { HelpScene } from './scenes/help.scene';
import { MainScene } from './scenes/main.scene';
import { OptionsScene } from './scenes/options.scene';

export const GAME_CONTAINER = 'game-container';
export const GAME_BACKGROUND_COLOR = '#35654d';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: GAME_BACKGROUND_COLOR,
  parent: GAME_CONTAINER,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%'
  },
  scene: [OptionsScene, MainScene, HelpScene]
};
