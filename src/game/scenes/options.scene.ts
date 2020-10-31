import Phaser from 'phaser';

import { throttleCallback } from '../../utils/throttle-callback';
import { GameScenes } from '../game-scenes.enum';

export class OptionsScene extends Phaser.Scene {
  constructor() {
    super(GameScenes.Options);
  }

  public init(data: object): void {
    console.log('options#init', data);
  }

  public preload(): void {
    console.log('options#preload');
  }

  public create(data: object): void {
    console.log('options#create', data);
    this.scale.on('resize', throttleCallback(this.resize, 50, this));
  }

  public update(time: number, delta: number): void {
    // console.log('options#update', time, delta);
  }

  public resize(
    gameSize: Phaser.Structs.Size,
    baseSize: Phaser.Structs.Size,
    displaySize: Phaser.Structs.Size
  ): void {
    console.log('options#resize', gameSize, baseSize, displaySize);
    // this.cameras.resize(gameSize.width, gameSize.height);
  }
}
