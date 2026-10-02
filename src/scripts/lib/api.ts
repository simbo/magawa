import { slashJoin } from 'path-slashes';

/**
 * Builds an API URL by joining path segments and encoding query parameters.
 *
 * @param pathParams - Path segment or segments appended to the configured API base.
 * @param queryParams - Query parameters to encode into the URL.
 * @returns The complete API URL.
 */
export function apiUrl(pathParams: string | string[], queryParams: Record<string, string> = {}): string {
  pathParams = Array.isArray(pathParams) ? pathParams : [pathParams];
  const url = new URL(APP_API_URL);
  url.pathname = slashJoin(url.pathname, ...pathParams);
  const query = new URLSearchParams(queryParams);
  url.search = query.toString();
  return url.href;
}

/**
 * Fetches a URL and parses its JSON body as the requested result type.
 * HTTP status codes are not validated here; network and JSON parsing errors propagate.
 *
 * @param url - URL to request.
 * @param options - Browser fetch options.
 * @returns The parsed response body.
 */
export async function apiFetch<O = unknown>(url: string, options: RequestInit = {}): Promise<O> {
  const response = await globalThis.fetch(url, options);
  const json = (await response.json()) as O;
  return json;
}

/**
 * Sends a JSON payload with a POST request and parses the JSON response.
 *
 * @param url - Destination URL.
 * @param payload - Value serialized into the request body.
 * @returns The parsed response body.
 */
export async function apiPost<O = unknown>(url: string, payload: unknown): Promise<O> {
  return apiFetch<O>(url, {
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    method: 'post',
    body: JSON.stringify(payload),
  });
}
