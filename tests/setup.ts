import { cleanup } from '@testing-library/preact';
import { afterEach, vi } from 'vitest';

vi.stubEnv('DEV', false);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Node plugin tests have no browser storage.
  if (globalThis.localStorage !== undefined) globalThis.localStorage.clear();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Node plugin tests have no browser history.
  if (globalThis.history !== undefined) globalThis.history.replaceState(null, '', '/');
});
