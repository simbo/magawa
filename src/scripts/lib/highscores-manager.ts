import { compareAsc } from 'date-fns';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import { nanoid } from 'nanoid';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import {
  HighscoreGameDifficulty,
  Highscores,
  HighscoresCompressed,
  HighscoresEntry,
  HighscoresForDifficulty,
  HighscoresList
} from './highscores.interface';

const STORAGE_URI = `https://jsonstorage.net/api/items/${
  process.env.NODE_ENV === 'production'
    ? '92724162-5354-4099-9b3a-112dfa90706a'
    : 'c76f2d14-1c79-4aa3-8cc8-c997e168babe'
}`;

class HighscoresManager {
  private readonly storageURI = STORAGE_URI;

  private highscores!: Highscores;

  public add(
    time: number,
    player: string,
    difficulty: HighscoreGameDifficulty
  ): Observable<{
    entry: HighscoresEntry;
    highscores: HighscoresForDifficulty;
  }> {
    let entry: HighscoresEntry = {
      id: nanoid(),
      date: new Date(),
      time,
      player,
      difficulty
    };
    return this.request().pipe(
      mergeMap(highscores => {
        highscores[difficulty].push(entry);
        highscores[difficulty] = this.sortList(highscores[difficulty]);
        highscores[difficulty] = this.rankList(highscores[difficulty]);
        entry = this.findId(highscores, entry.id, difficulty);
        highscores.updated = new Date();
        return this.send(highscores);
      }),
      map(highscores => ({
        entry,
        highscores: {
          list: highscores[difficulty].slice(0, 10),
          updated: highscores.updated
        }
      }))
    );
  }

  public get(
    difficulty: HighscoreGameDifficulty,
    player?: string,
    maxEntries = 10
  ): Observable<HighscoresForDifficulty> {
    return this.getHighscores().pipe(
      map((allHighscores: Highscores) => {
        const highscores: HighscoresForDifficulty = {
          list: allHighscores[difficulty],
          updated: allHighscores.updated
        };
        if (player && player.length > 0) {
          player = player.toLowerCase();
          highscores.list = highscores.list.filter(entry => entry.player.toLowerCase() === player);
        }
        if (typeof maxEntries === 'number' && maxEntries > 0) {
          highscores.list = highscores.list.slice(0, maxEntries);
        }
        return highscores;
      })
    );
  }

  private getHighscores(): Observable<Highscores> {
    return this.highscores ? of<Highscores>(this.highscores) : this.request();
  }

  private request(): Observable<Highscores> {
    return from<Promise<HighscoresCompressed>>(fetch(this.storageURI).then(async response => response.json())).pipe(
      map(compressed => this.decompress(compressed)),
      tap(highscores => {
        this.highscores = highscores;
      })
    );
  }

  private send(highscores: Highscores): Observable<Highscores> {
    return from<Promise<Response>>(
      fetch(this.storageURI, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        method: 'put',
        body: JSON.stringify(this.compress(highscores))
      })
    ).pipe(
      map(() => {
        this.highscores = highscores;
        return highscores;
      })
    );
  }

  private findId(highscores: Highscores, entryId: string, difficulty: HighscoreGameDifficulty): HighscoresEntry {
    return highscores[difficulty].find(({ id }) => id === entryId) as HighscoresEntry;
  }

  private sortList(list: HighscoresList): HighscoresList {
    return list.sort((a, b) => {
      const timeCompare = compareAsc(a.time, b.time);
      return timeCompare === 0 ? compareAsc(a.date, b.date) : timeCompare;
    });
  }

  private rankList(list: HighscoresList): HighscoresList {
    return list.map((entry, i) => ({ ...entry, rank: i + 1 }));
  }

  private compress(highscores: Highscores): HighscoresCompressed {
    return [compressToUTF16(JSON.stringify(highscores))];
  }

  private decompress([compressed]: HighscoresCompressed): Highscores {
    return Object.entries(JSON.parse(decompressFromUTF16(compressed) as string)).reduce(
      (highscores, [key, value]) => ({
        ...highscores,
        [key]:
          key === 'updated'
            ? new Date(value as string)
            : (value as HighscoresList).map(entry => ({
                ...entry,
                date: new Date(entry.date)
              }))
      }),
      {} as Highscores
    );
  }
}

export const highscoresManager = new HighscoresManager();
