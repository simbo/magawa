import Phaser from 'phaser';

import { throttleCallback } from '../../utils/throttle-callback';
import { GameScenes } from '../game-scenes.enum';

export class HelpScene extends Phaser.Scene {
  constructor() {
    super(GameScenes.Help);
  }

  public init(data: object): void {
    console.log('help#init', data);
  }

  public preload(): void {
    console.log('help#preload');
  }

  public create(data: object): void {
    console.log('help#create', data);
    this.scale.on('resize', throttleCallback(this.resize, 50, this));
  }

  public update(time: number, delta: number): void {
    // console.log('help#update', time, delta);
  }

  public resize(
    gameSize: Phaser.Structs.Size,
    baseSize: Phaser.Structs.Size,
    displaySize: Phaser.Structs.Size
  ): void {
    console.log('help#resize', gameSize, baseSize, displaySize);
    // this.cameras.resize(gameSize.width, gameSize.height);
  }
}
