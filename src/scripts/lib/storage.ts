import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import { createStore } from 'store/src/store-engine';
import cookieStorage from 'store/storages/cookieStorage';
import localStorage from 'store/storages/localStorage';

import { GameDifficultySettings } from './game-difficulty-settings.interface';
import { GameDifficulty } from './game-difficulty.enum';

const STORAGE_DATA_VERSION = 1;

enum StorageKey {
  DataVersion = 'dataVersion',
  Data = 'data'
}

interface StorageData {
  player: string | null;
  difficulty: GameDifficulty;
  difficultySettings: GameDifficultySettings;
}

class Storage {
  private readonly version = STORAGE_DATA_VERSION;
  private readonly storage = createStore([localStorage, cookieStorage]);
  private readonly defaultData = compressToUTF16(JSON.stringify({}));

  private data!: StorageData;

  constructor() {
    this.verifyDataVersion();
    this.read();
  }

  public set(data: Partial<StorageData>): void {
    this.data = { ...this.data, ...data };
    this.write();
  }

  public get(fallback: StorageData): StorageData {
    return { ...fallback, ...this.data };
  }

  private read(): void {
    this.data = JSON.parse(decompressFromUTF16(this.storage.get(StorageKey.Data, this.defaultData)) as string);
  }

  private write(): void {
    this.storage.set(StorageKey.Data, compressToUTF16(JSON.stringify(this.data)));
  }

  private verifyDataVersion(): void {
    const version = this.storage.get(StorageKey.DataVersion, this.version);
    if (version !== this.version) {
      this.storage.clearAll();
    }
    this.storage.set(StorageKey.DataVersion, this.version);
  }
}

export const storage = new Storage();
