import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

import { GameDifficulty, GameDifficultySettings } from './game-difficulty';

enum StorageKey {
  DataVersion = 'dataVersion',
  Data = 'data'
}

const STORAGE_DATA_VERSION = 1;
const STORAGE_KEY_PREFIX = 'magawa';

interface StorageData {
  player: string | null;
  difficulty: GameDifficulty;
  difficultySettings: GameDifficultySettings;
}

class Storage {
  private data!: StorageData;
  private readonly dataKey = `${STORAGE_KEY_PREFIX}_${StorageKey.Data}`;
  private readonly versionKey = `${STORAGE_KEY_PREFIX}_${StorageKey.DataVersion}`;

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
    let data: StorageData;
    try {
      data = JSON.parse(decompressFromUTF16(window.localStorage.getItem(this.dataKey) || ''));
    } catch {
      data = { ...this.data };
    }
    this.data = data;
  }

  private write(): void {
    window.localStorage.setItem(this.dataKey, compressToUTF16(JSON.stringify(this.data || {})));
    window.localStorage.setItem(this.versionKey, JSON.stringify(`${STORAGE_DATA_VERSION}`));
  }

  private verifyDataVersion(): void {
    let version: number;
    try {
      version = Number.parseInt(
        JSON.parse(window.localStorage.getItem(this.versionKey) || `${STORAGE_DATA_VERSION}`),
        10
      );
    } catch {
      version = STORAGE_DATA_VERSION;
    }
    if (version !== STORAGE_DATA_VERSION) {
      window.localStorage.removeItem(this.dataKey);
      window.localStorage.removeItem(this.versionKey);
    }
  }
}

export const storage = new Storage();
