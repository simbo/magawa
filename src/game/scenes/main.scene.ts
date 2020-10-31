import Phaser from 'phaser';

import { throttleCallback } from '../../utils/throttle-callback';


export class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  public init(data: object): void {
    console.log('main#init', data);
  }

  public preload(): void {
    console.log('main#preload');
  }

  public create(data: object): void {
    console.log('main#create', data);
    this.scale.on('resize', throttleCallback(this.resize, 50, this));
  }

  public update(time: number, delta: number): void {
    // console.log('main#update', time, delta);
  }

  public resize(
    gameSize: Phaser.Structs.Size,
    baseSize: Phaser.Structs.Size,
    displaySize: Phaser.Structs.Size
  ): void {
    console.log('main#resize', gameSize, baseSize, displaySize);
    this.cameras.resize(gameSize.width, gameSize.height);
  }
}
