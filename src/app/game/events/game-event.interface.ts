import { GameEventType } from './game-event-type.enum';


export interface GameEvent {
  type: GameEventType;
  data: any;
}
