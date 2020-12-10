import Pixi from 'pixi.js';

declare namespace PIXI {
  export class Application extends Pixi.Application {}
  export class Loader extends Pixi.Loader {}
  export class LoaderResource extends Pixi.LoaderResource {}
  export class Container extends Pixi.Container {}
  export class Graphics extends Pixi.Graphics {}
  export class Sprite extends Pixi.Sprite {}
  export class Texture extends Pixi.Texture {}
  export class Text extends Pixi.Text {}
  export class InteractionEvent extends Pixi.InteractionEvent {}
  export namespace utils {
    export function skipHello(): void;
  }
}
