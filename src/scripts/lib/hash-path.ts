import { AppRoute } from './app-route.enum';

/**
 * Extracts a route path without query parameters or trailing slashes.
 * The original URL stays intact, so query parameters remain available to callers.
 *
 * @param hash - URL fragment including its leading hash character.
 * @returns The normalized path, defaulting to home for an empty path.
 */
export function normalizeHashPath(hash: string): string {
  const path = hash.replace(/^#/, '').split('?', 1)[0];
  return path.replace(/\/+$/, '') || AppRoute.Home;
}
