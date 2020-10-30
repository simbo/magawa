import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as shuffle from 'shuffle-array';

import { GameEventType } from '../events/game-event-type.enum';
import { GameEventsService } from '../events/game-events.service';
import { GameOptionsService } from '../options/game-options.service';
import { GameState } from '../state/game-state.enum';
import { GameTile } from './game-board/game-tile/game-tile.model';


@Injectable()
export class GameBoardService {

  private readonly tilesSubject = new BehaviorSubject<GameTile[]>([]);

  private readonly minesIndexSubject = new BehaviorSubject<boolean[]>([]);

  constructor(
    private readonly events: GameEventsService,
    private readonly options: GameOptionsService
  ) { }

  public get tiles$(): Observable<GameTile[]> {
    return this.tilesSubject.asObservable();
  }

  public get flagsCount$(): Observable<number> {
    return this.tiles$.pipe(
      map(tiles => tiles.filter(tile => tile.flagged).length)
    );
  }

  public getTile(x: number, y: number): Observable<GameTile> {
    return this.tiles$.pipe(
      map(tiles => tiles[this.getTileIndex(x, y)])
    );
  }

  public toggleFlagTile(x: number, y: number): void {
    const tiles = this.tilesSubject.getValue();
    const tile = tiles[this.getTileIndex(x, y)];
    tile.toggleFlag();
    this.updateTilesState(tiles);
  }

  public uncoverTile(x: number, y: number): void {
    const tiles = this.tilesSubject.getValue();
    const tile = tiles[this.getTileIndex(x, y)];
    if (!tile.covered) {
      return;
    }
    tile.uncover();
    if (tile.mined) {
      this.events.push(GameEventType.End, GameState.Lost);
    } else if (tile.nearbyMines === 0) {
      this.getNearbyTileCoordinates(x, y)
        .forEach(([a, b]) => this.uncoverTile(a, b));
    }
    this.updateTilesState(tiles);
  }

  public uncoverAllTiles(): void {
    const tiles = this.tilesSubject.getValue();
    tiles.forEach(tile => tile.uncover());
    this.updateTilesState(tiles);
  }

  public initialize(): void {
    this.createMinesIndex();
    this.createTiles();
  }

  private createMinesIndex(): void {
    const minesIndex: boolean[] = [];
    for (let i = 0; i < this.options.tilesX * this.options.tilesY; i++) {
      minesIndex.push(i < this.options.minesCount);
    }
    this.minesIndexSubject.next(shuffle(minesIndex));
  }

  private createTiles(): void {
    const tiles: GameTile[] = [];
    for (let y = 0; y < this.options.tilesY; y++ ) {
      for (let x = 0; x < this.options.tilesX; x++ ) {
        tiles.push(new GameTile(
          x, y, this.tileIsMined(x, y), this.getNearbyMinesCount(x, y)
        ));
      }
    }
    this.tilesSubject.next(tiles);
  }

  private updateTilesState(tiles: GameTile[]): void {
    if (this.allMinesFlagged(tiles)) {
      this.events.push(GameEventType.End, GameState.Won);
    } else {
      this.tilesSubject.next(tiles);
    }
  }

  private allMinesFlagged(tiles: GameTile[] = this.tilesSubject.getValue()): boolean {
    return tiles.every(tile => (tile.mined && tile.flagged) || (!tile.covered && !tile.mined));
  }

  private getTileIndex(x: number, y: number): number {
    return y * this.options.tilesX + x;
  }

  private getNearbyTileCoordinates(x: number, y: number): [number, number][] {
    const nearbyTiles: [number, number][] = [
      [x - 1, y - 1], [x + 0, y - 1], [x + 1, y - 1],
      [x - 1, y + 0],                 [x + 1, y + 0],
      [x - 1, y + 1], [x + 0, y + 1], [x + 1, y + 1]
    ];
    return nearbyTiles.filter(([a, b]) =>
      a >= 0 && a < this.options.tilesX && b >= 0 && b < this.options.tilesY
    );
  }

  private getNearbyMinesCount(x: number, y: number): number {
    return this.getNearbyTileCoordinates(x, y)
      .filter(([a, b]) => this.tileIsMined(a, b)).length;
  }

  private tileIsMined(x: number, y: number): boolean {
    return this.minesIndexSubject.getValue()[this.getTileIndex(x, y)];
  }

}
