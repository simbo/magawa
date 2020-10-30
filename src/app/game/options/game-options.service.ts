import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { GameEventType } from '../events/game-event-type.enum';
import { GameEventsService } from '../events/game-events.service';
import { gameDifficultyOptions } from './game-difficulty-options';
import { GameDifficulty } from './game-difficulty.enum';
import { GameOptions } from './game-options.interface';


@Injectable()
export class GameOptionsService {

  private readonly defaultDifficulty: GameDifficulty = GameDifficulty.Easy;

  private readonly difficultySubject = new BehaviorSubject<GameDifficulty>(
    this.defaultDifficulty
  );

  private readonly optionsSubject = new BehaviorSubject<GameOptions>(
    this.getDifficultyOptions(this.defaultDifficulty)
  );

  private readonly optionsVisibleSubject = new BehaviorSubject<boolean>(true);

  constructor(
    private events: GameEventsService
  ) { }

  public get difficulty$(): Observable<GameDifficulty> {
    return this.difficultySubject.asObservable();
  }

  public get difficulty(): GameDifficulty {
    return this.difficultySubject.getValue();
  }

  public get options$(): Observable<GameOptions> {
    return this.difficulty$.pipe(
      mergeMap(difficulty => difficulty === GameDifficulty.Custom ?
        this.optionsSubject.asObservable() : of(this.getDifficultyOptions(difficulty))
      )
    );
  }

  public get options(): GameOptions {
    return this.difficulty === GameDifficulty.Custom ?
      this.optionsSubject.getValue() : this.getDifficultyOptions(this.difficulty);
  }

  public get tilesX$(): Observable<number> {
    return this.options$.pipe(
      map(options => options.tilesX)
    );
  }

  public get tilesX(): number {
    return this.options.tilesX;
  }

  public get tilesY$(): Observable<number> {
    return this.options$.pipe(
      map(options => options.tilesY)
    );
  }

  public get tilesY(): number {
    return this.options.tilesY;
  }

  public get minesCount$(): Observable<number> {
    return this.options$.pipe(
      map(options => options.minesCount)
    );
  }

  public get minesCount(): number {
    return this.options.minesCount;
  }

  public get visible$(): Observable<boolean> {
    return this.optionsVisibleSubject.asObservable();
  }

  public set(difficulty: GameDifficulty, options?: GameOptions): void {
    this.difficultySubject.next(difficulty);
    this.optionsSubject.next(options || this.getDifficultyOptions(difficulty));
  }

  public show(): void {
    this.events.push(GameEventType.Pause);
    this.optionsVisibleSubject.next(true);
  }

  public hide(): void {
    this.optionsVisibleSubject.next(false);
    this.events.push(GameEventType.Unpause);
  }

  public getDifficultyOptions(difficulty: GameDifficulty): GameOptions {
    return gameDifficultyOptions.get(difficulty) as GameOptions;
  }

}
