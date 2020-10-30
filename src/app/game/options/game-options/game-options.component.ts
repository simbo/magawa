import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { GameService } from '../../game.service';
import { GameStateService } from '../../state/game-state.service';
import { GameDifficulty } from '../game-difficulty.enum';
import { GameOptionsService } from '../game-options.service';


@Component({
  selector: 'm-game-options',
  templateUrl: './game-options.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameOptionsComponent implements OnInit, OnDestroy {

  public readonly formGroup: FormGroup;
  public readonly gameDifficulties: string[] = Object.values(GameDifficulty);

  public minTilesX!: number;
  public maxTilesX!: number;
  public minTilesY!: number;
  public maxTilesY!: number;
  public minMinesCount!: number;
  public maxMinesCount!: number;

  private readonly unsubscribeSubject = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly game: GameService,
    private readonly state: GameStateService,
    private readonly options: GameOptionsService
  ) {

    this.formGroup = this.formBuilder.group({
      difficulty: GameDifficulty.Easy,
      tilesX: 0,
      tilesY: 0,
      minesCount: 0
    });
    this.setGameDifficulty(GameDifficulty.Easy);

  }

  public ngOnInit(): void {
    this.formGroup.controls.difficulty.valueChanges
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((difficulty: GameDifficulty) =>
        this.setGameDifficulty(difficulty)
      );
  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject.next();
  }

  public get gameInProgress$(): Observable<boolean> {
    return this.state.isInitializing$.pipe(
      map(state => !state)
    );
  }

  public get isCustom(): boolean {
    return this.formGroup.controls.difficulty.value === GameDifficulty.Custom;
  }

  public get isValid(): boolean {
    return this.formGroup.valid;
  }

  public start(event: Event): void {
    event.preventDefault();
    this.options.hide();
    this.game.start(
      this.formGroup.controls.difficulty.value,
      this.isCustom ? {
        tilesX: this.formGroup.controls.tilesX.value,
        tilesY: this.formGroup.controls.tilesY.value,
        minesCount: this.formGroup.controls.minesCount.value
      } : undefined
    );
  }

  public cancel(event: Event): void {
    event.preventDefault();
    this.options.hide();
  }

  private setGameDifficulty(difficulty: GameDifficulty): void {
    const options = this.options.getDifficultyOptions(difficulty);
    if (!options) { return; }
    this.formGroup.controls.tilesX.setValue(options.tilesX);
    this.formGroup.controls.tilesY.setValue(options.tilesY);
    this.formGroup.controls.minesCount.setValue(options.minesCount);
    this.minTilesX = options.tilesX;
    this.maxTilesX = options.tilesX;
    this.minTilesY = options.tilesY;
    this.maxTilesY = options.tilesY;
    this.minMinesCount = difficulty === GameDifficulty.Custom ? 10 : options.minesCount;
    this.maxMinesCount = options.minesCount;
  }

}
