// src/services/githubService.ts

export const GITHUB_API = "https://api.github.com";

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
};

export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
};

type FetchWithTimeoutOptions = RequestInit & {
  timeoutMs?: number;
};

function fetchWithTimeout(
  url: string,
  { timeoutMs = 8000, ...options }: FetchWithTimeoutOptions = {},
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(id),
  );
}

async function safeJson<T>(res: Response): Promise<T | string | null> {
  const text = await res.text();
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return text || null;
  }
}

function buildError(res: Response, body: unknown): Error {
  const status = res.status;

  if (status === 404) return new Error("User not found (404)");
  if (status === 403)
    return new Error("Rate limit / forbidden (403) — ลองใหม่ทีหลัง");
  if (status === 429)
    return new Error("Too many requests (429) — โดนจำกัดการเรียก");

  const extra =
    typeof body === "string"
      ? body.slice(0, 120)
      : body
        ? JSON.stringify(body).slice(0, 120)
        : "";

  return new Error(`GitHub API error: ${status}${extra ? ` - ${extra}` : ""}`);
}

export async function getGitHubProfile(
  username: string,
  opts?: { timeoutMs?: number },
): Promise<GitHubProfile> {
  const url = `${GITHUB_API}/users/${encodeURIComponent(username)}`;
  const res = await fetchWithTimeout(url, { timeoutMs: opts?.timeoutMs });

  const body = await safeJson<GitHubProfile>(res);
  if (!res.ok) throw buildError(res, body);

  return body as GitHubProfile;
}

export async function getGitHubRepos(
  username: string,
  opts?: {
    perPage?: number;
    sort?: "created" | "updated" | "pushed" | "full_name";
    timeoutMs?: number;
  },
): Promise<GitHubRepo[]> {
  const perPage = opts?.perPage ?? 100;
  const sort = opts?.sort ?? "updated";

  const url = `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&sort=${sort}`;
  const res = await fetchWithTimeout(url, { timeoutMs: opts?.timeoutMs });

  const body = await safeJson<GitHubRepo[]>(res);
  if (!res.ok) throw buildError(res, body);

  return Array.isArray(body) ? (body as GitHubRepo[]) : [];
}

export function getContributionsSvgUrl(username: string): string {
  return `https://ghchart.rshah.org/${encodeURIComponent(username)}`;
}
