import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameState } from './game-state.enum';


@Injectable()
export class GameStateService {

  private readonly stateSubject = new BehaviorSubject<GameState>(GameState.Initializing);

  constructor() { }

  public get state$(): Observable<GameState> {
    return this.stateSubject.asObservable();
  }

  public get state(): GameState {
    return this.stateSubject.getValue();
  }

  public get isInitializing$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state === GameState.Initializing)
    );
  }

  public get isInitializing(): boolean {
    return this.state === GameState.Initializing;
  }

  public get isRunning$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state === GameState.Running)
    );
  }

  public get isRunning(): boolean {
    return this.state === GameState.Running;
  }

  public get isPaused$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state === GameState.Paused)
    );
  }

  public get isPaused(): boolean {
    return this.state === GameState.Paused;
  }

  public get isWon$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state === GameState.Won)
    );
  }

  public get isWon(): boolean {
    return this.state === GameState.Won;
  }

  public get isLost$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state === GameState.Lost)
    );
  }

  public get isLost(): boolean {
    return this.state === GameState.Lost;
  }

  public set(state: GameState): void {
    this.stateSubject.next(state);
  }

  public setInitializing(): void {
    this.set(GameState.Initializing);
  }

  public setRunning(): void {
    this.set(GameState.Running);
  }

  public setPaused(): void {
    this.set(GameState.Paused);
  }

  public setWon(): void {
    this.set(GameState.Won);
  }

  public setLost(): void {
    this.set(GameState.Lost);
  }

}
