import { slashJoin } from 'path-slashes';

export function apiUrl(pathParams: string | string[], queryParams: { [key: string]: string } = {}): string {
  pathParams = Array.isArray(pathParams) ? pathParams : [pathParams];
  const url = new URL(APP_API_URL);
  url.pathname = slashJoin(url.pathname, ...pathParams);
  const query = new URLSearchParams(Object.entries(queryParams));
  url.search = query.toString();
  return url.toString();
}

export async function apiFetch<O = unknown>(url: string, options: RequestInit = {}): Promise<O> {
  const response = await fetch(url, options);
  const json = (await response.json()) as O;
  return json;
}

export async function apiPost<I = unknown, O = unknown>(url: string, payload: I): Promise<O> {
  return apiFetch<O>(url, {
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    method: 'post',
    body: JSON.stringify(payload)
  });
}
