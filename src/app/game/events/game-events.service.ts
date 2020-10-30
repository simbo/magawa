import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { GameEventType } from './game-event-type.enum';
import { GameEvent } from './game-event.interface';


@Injectable()
export class GameEventsService {

  private readonly events = new Subject<GameEvent>();

  public push<T = undefined>(type: GameEventType, data?: T): void {
    this.events.next({ type, data });
  }

  public listen<T = undefined>(type: GameEventType): Observable<T> {
    return this.events.pipe(
      filter(msg => type === msg.type),
      map(msg => msg.data)
    );
  }

}
