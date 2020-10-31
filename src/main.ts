import { GAME_CONTAINER, gameConfig } from './game/game-config';

try {
  new Phaser.Game(gameConfig);
} catch (err) {
  console.error(err);
  const gameContainer = document.getElementById(GAME_CONTAINER);
  if (gameContainer) {
    gameContainer.append('ERROR: game initialization failed');
    gameContainer.style.color = '#ffae42';
  }
}
