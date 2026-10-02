import lzString from 'lz-string';

import type { GameDifficulty, GameDifficultySettings } from './game-difficulty';

/**
 * Suffixes used for the versioned local-storage entries.
 */
enum StorageKey {
  DataVersion = 'dataVersion',
  Data = 'data',
}

const STORAGE_DATA_VERSION = 1;
const STORAGE_KEY_PREFIX = 'magawa';

/**
 * Persisted preferences. Each reader supplies defaults for the fields it needs.
 */
interface StorageData {
  player?: string | null;
  difficulty?: GameDifficulty;
  difficultySettings?: GameDifficultySettings;
  devMode?: boolean;
}

/**
 * Reads and writes compressed preferences under versioned local-storage keys.
 */
class Storage {
  private data: StorageData = {};
  private readonly dataKey = `${STORAGE_KEY_PREFIX}_${StorageKey.Data}`;
  private readonly versionKey = `${STORAGE_KEY_PREFIX}_${StorageKey.DataVersion}`;

  /**
   * Invalidates incompatible stored data and reads the current preferences.
   */
  public constructor() {
    this.verifyDataVersion();
    this.read();
  }

  /**
   * Merges supplied preferences into the cached data and persists the result.
   *
   * @param data - Preference fields to merge and persist.
   */
  public set(data: Partial<StorageData>): void {
    this.data = { ...this.data, ...data };
    this.write();
  }

  /**
   * Returns cached preferences overlaid on the caller's defaults without changing storage.
   *
   * @param fallback - Defaults for preferences not yet saved.
   * @returns Saved preferences merged with the provided defaults.
   */
  public get(fallback: StorageData): StorageData {
    return { ...fallback, ...this.data };
  }

  /**
   * Decompresses and parses saved preferences, retaining cached data if parsing fails.
   */
  private read(): void {
    let data: StorageData;
    try {
      data = (JSON.parse(lzString.decompressFromUTF16(globalThis.localStorage.getItem(this.dataKey) ?? '')) ??
        {}) as StorageData;
    } catch {
      data = { ...this.data };
    }
    this.data = data;
  }

  /**
   * Stores compressed preference JSON and the current data-version marker.
   */
  private write(): void {
    globalThis.localStorage.setItem(this.dataKey, lzString.compressToUTF16(JSON.stringify(this.data)));
    globalThis.localStorage.setItem(this.versionKey, JSON.stringify(String(STORAGE_DATA_VERSION)));
  }

  /**
   * Clears saved preferences when their parsed version differs from the supported version.
   */
  private verifyDataVersion(): void {
    let version: number;
    try {
      version = Number(
        JSON.parse(globalThis.localStorage.getItem(this.versionKey) ?? String(STORAGE_DATA_VERSION)) as unknown,
      );
    } catch {
      version = STORAGE_DATA_VERSION;
    }
    if (version === STORAGE_DATA_VERSION) {
      return;
    }

    globalThis.localStorage.removeItem(this.dataKey);
    globalThis.localStorage.removeItem(this.versionKey);
  }
}

/**
 * Shared preference cache backed by compressed, versioned browser local storage.
 */
export const storage = new Storage();
