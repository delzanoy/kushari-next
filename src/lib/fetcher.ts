// ─── Base URL ─────────────────────────────────────────────────────────────────
// Returns null when NEXT_PUBLIC_BASE_URL is not set so SWR suspends the fetch
// rather than firing a request to "undefined/...".

export const apiUrl = (path: string): string | null =>
  process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${path}`
    : null;

// ─── Error class ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────
// All SWR hooks route through here — add auth headers once auth is wired.

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(
      `${res.status} ${res.statusText}`,
      res.status,
      url,
    );
  }

  return res.json() as Promise<T>;
}
