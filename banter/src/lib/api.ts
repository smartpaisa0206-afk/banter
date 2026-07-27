/**
 * Tiny resilient fetch helper. Centralises AbortController handling, a single
 * transparent retry on network blips, and consistent error shaping so the UI
 * never has to repeat the same try/catch boilerplate.
 */
export interface ApiResult<T = any> {
  ok: boolean;
  status: number;
  data: T;
}

export async function postJSON<T = any>(
  url: string,
  body: unknown,
  opts: { signal?: AbortSignal; retries?: number; timeoutMs?: number } = {},
): Promise<ApiResult<T>> {
  const retries = opts.retries ?? 1;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), opts.timeoutMs ?? 20_000);
    if (opts.signal) opts.signal.addEventListener('abort', () => ac.abort());
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ac.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
        continue;
      }
    }
  }
  return { ok: false, status: 0, data: { error: 'Network error. Check your connection and try again.' } } as ApiResult<T>;
}

export async function getJSON<T = any>(url: string, opts: { signal?: AbortSignal } = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' }, signal: opts.signal });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'Network error.' } } as ApiResult<T>;
  }
}
