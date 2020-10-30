import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, merge, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { GameStateService } from '../state/game-state.service';


@Injectable()
export class GameTimerService {

  private readonly startedSubject = new BehaviorSubject<Date | null>(null);
  private readonly expiredSubject = new BehaviorSubject<number>(0);

  constructor(
    private state: GameStateService
  ) { }

  public get duration$(): Observable<number> {
    return merge(
      // this.expiredSubject.asObservable().pipe(
      //   filter(timerExpired => timerExpired === 0)
      // ),
      this.state.state$.pipe(
        mergeMap(() => this.expiredSubject.asObservable())
      ),
      interval(1000).pipe(
        map(() => {
          if (!this.state.isRunning) {
            return this.expiredSubject.getValue();
          }
          const timerStarted = this.startedSubject.getValue();
          const startedAt = timerStarted === null ?
            0 : timerStarted.getTime();
          const now = (new Date()).getTime();
          const diff = now - startedAt + this.expiredSubject.getValue();
          return Math.max(0, diff);
        })
      )
    );
  }

  public startTimer(): void {
    this.startedSubject.next(new Date());
  }

  public stopTimer(): void {
    let timerExpired = this.expiredSubject.getValue();
    const timerStarted = this.startedSubject.getValue();
    timerExpired += timerStarted === null ?
      0 : (new Date()).getTime() - timerStarted.getTime();
    this.expiredSubject.next(timerExpired);
    this.startedSubject.next(null);
  }

  public resetTimer(): void {
    this.startedSubject.next(null);
    this.expiredSubject.next(0);
  }

}
